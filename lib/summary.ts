/**
 * Turkish summary and formatting helpers for ledger entries
 */

/**
 * Generate human-readable Turkish summary for a ledger entry
 */
export function summarizeEntryTR(
  e: { refType?: string | null; refId?: string | null },
  debit: { code: string },
  credit: { code: string },
  ctx?: {
    customer?: string;
    invoiceNo?: string;
    category?: string;
    note?: string;
  }
): string {
  const { refType, refId } = e;
  const { customer, invoiceNo, category, note } = ctx || {};

  // Collection (Customer payment)
  if (refType === "Payment" && debit.code === "1001" && credit.code === "1200") {
    return `Müşteri tahsilatı${customer ? ` – ${customer}` : ""}${
      invoiceNo ? ` (Fatura ${invoiceNo})` : ""
    }`;
  }

  if (refType === "Payment" && debit.code === "1020" && credit.code === "1200") {
    return `Banka havalesi${customer ? ` – ${customer}` : ""}${
      invoiceNo ? ` (Fatura ${invoiceNo})` : ""
    }`;
  }

  // Card fee
  if (refType === "Payment" && debit.code === "6000" && credit.code === "1001") {
    return "Kredi kartı komisyonu";
  }

  // Invoice issued
  if (refType === "Invoice" && debit.code === "1200" && credit.code === "7000") {
    return `Fatura düzenlendi${customer ? ` – ${customer}` : ""}${
      invoiceNo ? ` (${invoiceNo})` : ""
    }`;
  }

  // Expense
  if (debit.code === "6000") {
    return category
      ? `${category}${note ? ` – ${note}` : ""}`
      : note || "Gider";
  }

  // Fallback
  return `${refType || "İşlem"} - ${debit.code} → ${credit.code}`;
}

/**
 * Expense categories in Turkish
 */
export const expenseCategories = {
  "yakıt": "Yakıt",
  "maaş": "Maaş",
  "yemek": "Yemek",
  "kira": "Kira",
  "vergi": "Vergi",
  "parça": "Parça",
  "lisans": "Lisans",
  "elektrik": "Elektrik",
  "su": "Su",
  "internet": "İnternet",
  "bakım": "Bakım",
  "sigorta": "Sigorta",
  "reklam": "Reklam",
  "danışmanlık": "Danışmanlık",
  "diğer": "Diğer",
} as const;

export const expenseCategoryList = Object.values(expenseCategories);

/**
 * Payment method labels in Turkish
 */
export const paymentMethodLabels: Record<string, string> = {
  cash: "Nakit",
  card: "Kredi Kartı",
  transfer: "Havale/EFT",
};

/**
 * Format currency in TRY (Turkish Lira)
 */
export function formatCurrencyTR(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date in Turkish
 */
export function formatDateTR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Geçersiz tarih';
  }
  
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Format date and time in Turkish
 */
export function formatDateTimeTR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Geçersiz tarih';
  }
  
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

/**
 * AI-assisted expense description suggestions
 */
export function suggestExpenseDescription(category: string): string {
  const suggestions: Record<string, string[]> = {
    Yakıt: ["Araç yakıtı", "Dizel", "Benzin", "LPG"],
    Maaş: ["Aylık maaş ödemesi", "Teknisyen maaşı", "İdari personel maaşı"],
    Yemek: ["Personel yemeği", "Öğle yemeği", "Akşam yemeği"],
    Kira: ["Ofis kirası", "Depo kirası", "Araç kirası"],
    Vergi: ["KDV ödemesi", "Gelir vergisi", "Damga vergisi"],
    Parça: ["Yedek parça alımı", "Malzeme alımı"],
    Lisans: ["Yazılım lisansı", "Abonelik ücreti"],
    Elektrik: ["Elektrik faturası"],
    Su: ["Su faturası"],
    İnternet: ["İnternet faturası"],
    Bakım: ["Araç bakımı", "Ofis bakımı", "Ekipman bakımı"],
    Sigorta: ["Araç sigortası", "İşyeri sigortası", "Sorumluluk sigortası"],
    Reklam: ["Google Ads", "Facebook Ads", "Banner reklam"],
    Danışmanlık: ["Muhasebe danışmanlığı", "Hukuk danışmanlığı"],
    Diğer: ["Çeşitli giderler"],
  };

  const options = suggestions[category] || [""];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Analyze transaction pattern and provide AI insight (Turkish)
 */
export function analyzeTransactionPattern(transactions: any[]): string {
  if (transactions.length === 0) {
    return "Henüz işlem bulunmamaktadır.";
  }

  const total = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const avg = total / transactions.length;
  const recent = transactions.slice(0, 10);
  const recentAvg =
    recent.reduce((sum, t) => sum + (t.amount || 0), 0) / recent.length;

  if (recentAvg > avg * 1.2) {
    return `Son işlemleriniz ortalamanın %${Math.round(
      ((recentAvg - avg) / avg) * 100
    )} üzerinde. Harcamalarınız artış gösteriyor.`;
  }

  if (recentAvg < avg * 0.8) {
    return `Son işlemleriniz ortalamanın %${Math.round(
      ((avg - recentAvg) / avg) * 100
    )} altında. Harcamalarınız azalış gösteriyor.`;
  }

  return "İşlemleriniz normal seyrinde devam ediyor.";
}

/**
 * Invoice status labels in Turkish
 */
export const invoiceStatusLabels: Record<string, string> = {
  draft: "Taslak",
  open: "Açık",
  paid: "Ödendi",
  overdue: "Vadesi Geçmiş",
  void: "İptal Edildi",
};

/**
 * Get invoice status color
 */
export function getInvoiceStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "gray",
    open: "blue",
    paid: "green",
    overdue: "red",
    void: "gray",
  };
  return colors[status] || "gray";
}

/**
 * Calculate days until due or overdue
 */
export function getDueDays(dueDate: Date): { days: number; overdue: boolean } {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    days: Math.abs(diffDays),
    overdue: diffDays < 0,
  };
}

/**
 * Format due date text in Turkish
 */
export function formatDueDateTR(dueDate: Date): string {
  const { days, overdue } = getDueDays(dueDate);

  if (overdue) {
    return `${days} gün gecikmiş`;
  }

  if (days === 0) {
    return "Bugün vadesi doluyor";
  }

  if (days === 1) {
    return "Yarın vadesi doluyor";
  }

  return `${days} gün içinde vadesi dolacak`;
}
