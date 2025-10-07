import { prisma } from "@/lib/prisma";
import { summarizeEntryTR } from "./summary";

interface PostLedgerParams {
  date?: Date;
  debitCode: string;
  creditCode: string;
  amount: number;
  note?: string;
  refType?: string;
  refId?: string;
  cashSummary?: string;
  meta?: Record<string, any>;
}

/**
 * Post a double-entry ledger transaction
 */
export async function postLedger(
  tx: any,
  {
    date,
    debitCode,
    creditCode,
    amount,
    note,
    refType,
    refId,
    cashSummary,
    meta,
  }: PostLedgerParams
) {
  // Find debit and credit accounts
  const [debit, credit] = await Promise.all([
    tx.account.findUniqueOrThrow({ where: { code: debitCode } }),
    tx.account.findUniqueOrThrow({ where: { code: creditCode } }),
  ]);

  // Create ledger entry
  const entry = await tx.ledgerEntry.create({
    data: {
      date: date ?? new Date(),
      debitId: debit.id,
      creditId: credit.id,
      amount,
      note,
      refType,
      refId,
      meta: meta ? JSON.stringify(meta) : null,
    },
  });

  // Create cash note if this affects a cash-like account
  if (cashSummary && (debit.isCashLike || credit.isCashLike)) {
    await tx.cashNote.create({
      data: {
        entryId: entry.id,
        summary: cashSummary,
      },
    });
  }

  return entry;
}

/**
 * Get current cash balance (all cash-like accounts)
 */
export async function getCashBalance() {
  const cashAccounts = await prisma.account.findMany({
    where: { isCashLike: true },
    include: {
      debitEntries: true,
      creditEntries: true,
    },
  });

  let balance = 0;
  for (const account of cashAccounts) {
    const debitSum = account.debitEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    const creditSum = account.creditEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );

    // Cash increases with debits, decreases with credits
    if (account.type === "asset") {
      balance += debitSum - creditSum;
    }
  }

  return balance;
}

/**
 * Get total revenue (credit balances on revenue accounts)
 */
export async function getTotalRevenue(startDate?: Date, endDate?: Date) {
  const where: any = { type: "revenue" };
  
  const revenueAccounts = await prisma.account.findMany({
    where,
    include: {
      creditEntries: {
        where: {
          ...(startDate && { date: { gte: startDate } }),
          ...(endDate && { date: { lte: endDate } }),
        },
      },
    },
  });

  return revenueAccounts.reduce((total, account) => {
    const creditSum = account.creditEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    return total + creditSum;
  }, 0);
}

/**
 * Get total expenses (debit balances on expense accounts)
 */
export async function getTotalExpenses(startDate?: Date, endDate?: Date) {
  const expenseAccounts = await prisma.account.findMany({
    where: { type: "expense" },
    include: {
      debitEntries: {
        where: {
          ...(startDate && { date: { gte: startDate } }),
          ...(endDate && { date: { lte: endDate } }),
        },
      },
    },
  });

  return expenseAccounts.reduce((total, account) => {
    const debitSum = account.debitEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    return total + debitSum;
  }, 0);
}

/**
 * Get accounts receivable balance (A/R account debit balance)
 */
export async function getAccountsReceivable() {
  const arAccount = await prisma.account.findUnique({
    where: { code: "1200" }, // A/R account code
    include: {
      debitEntries: true,
      creditEntries: true,
    },
  });

  if (!arAccount) return 0;

  const debitSum = arAccount.debitEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );
  const creditSum = arAccount.creditEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );

  return debitSum - creditSum;
}

/**
 * Helper functions for common transactions
 */
export const ledgerHelpers = {
  /**
   * Record a customer payment (collection)
   */
  recordCollection: async ({
    customerId,
    invoiceId,
    amount,
    method,
    fee = 0,
    note,
  }: {
    customerId: string;
    invoiceId?: string;
    amount: number;
    method: string;
    fee?: number;
    note?: string;
  }) => {
    return prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          customerId,
          invoiceId,
          method,
          amount,
          fee,
          note,
        },
      });

      // Get customer for summary
      const customer = await tx.customer.findUnique({
        where: { id: customerId },
      });

      // Determine cash account based on method
      const cashCode = method === "transfer" ? "1020" : "1001"; // Bank or Cash

      // Post to ledger: Debit Cash/Bank, Credit A/R
      const cashSummary = summarizeEntryTR(
        { refType: "Payment", refId: payment.id },
        { code: cashCode },
        { code: "1200" },
        { customer: customer?.name }
      );

      await postLedger(tx, {
        debitCode: cashCode,
        creditCode: "1200", // A/R
        amount,
        refType: "Payment",
        refId: payment.id,
        note,
        cashSummary,
      });

      // If card payment, record fee as expense
      if (method === "card" && fee > 0) {
        await postLedger(tx, {
          debitCode: "6000", // Expense
          creditCode: cashCode,
          amount: fee,
          refType: "Payment",
          refId: payment.id,
          note: "Kredi kartı komisyonu",
          cashSummary: "Kredi kartı komisyonu",
        });
      }

      // Update invoice status if fully paid
      if (invoiceId) {
        const invoice = await tx.invoice.findUnique({
          where: { id: invoiceId },
          include: { payments: true },
        });

        if (invoice) {
          const totalPaid = invoice.payments.reduce(
            (sum, p) => sum + p.amount,
            0
          );
          if (totalPaid >= invoice.total) {
            await tx.invoice.update({
              where: { id: invoiceId },
              data: { status: "paid" },
            });
          }
        }
      }

      return payment;
    });
  },

  /**
   * Record an expense
   */
  recordExpense: async ({
    amount,
    category,
    note,
    date,
    paymentMethod = "cash",
  }: {
    amount: number;
    category: string;
    note?: string;
    date?: Date;
    paymentMethod?: string;
  }) => {
    return prisma.$transaction(async (tx) => {
      const cashCode = paymentMethod === "transfer" ? "1020" : "1001";

      const cashSummary = `${category}${note ? ` – ${note}` : ""}`;

      const entry = await postLedger(tx, {
        date,
        debitCode: "6000", // Expense
        creditCode: cashCode,
        amount,
        refType: "Expense",
        note,
        cashSummary,
        meta: { category },
      });

      return entry;
    });
  },

  /**
   * Issue an invoice (create A/R)
   */
  issueInvoice: async ({
    customerId,
    invoiceNo,
    subtotal,
    vatRate = 20,
    discount = 0,
    dueDate,
    note,
  }: {
    customerId: string;
    invoiceNo: string;
    subtotal: number;
    vatRate?: number;
    discount?: number;
    dueDate?: Date;
    note?: string;
  }) => {
    return prisma.$transaction(async (tx) => {
      // Calculate total
      const discountedSubtotal = subtotal - discount;
      const total = discountedSubtotal * (1 + vatRate / 100);

      // Create invoice
      const invoice = await tx.invoice.create({
        data: {
          invoiceNo,
          customerId,
          subtotal,
          vatRate,
          discount,
          total,
          dueDate,
          note,
          status: "open",
        },
      });

      // Get customer for summary
      const customer = await tx.customer.findUnique({
        where: { id: customerId },
      });

      // Post to ledger: Debit A/R, Credit Revenue
      const cashSummary = summarizeEntryTR(
        { refType: "Invoice", refId: invoice.id },
        { code: "1200" },
        { code: "7000" },
        { customer: customer?.name, invoiceNo }
      );

      await postLedger(tx, {
        debitCode: "1200", // A/R
        creditCode: "7000", // Revenue
        amount: total,
        refType: "Invoice",
        refId: invoice.id,
        note,
        cashSummary,
      });

      return invoice;
    });
  },
};
