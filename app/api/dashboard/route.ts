import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Servis istatistikleri
    const totalServices = await prisma.service.count()
    const pendingServices = await prisma.service.count({ where: { status: 'pending' } })
    const inProgressServices = await prisma.service.count({ where: { status: 'in_progress' } })
    const completedServices = await prisma.service.count({ where: { status: 'completed' } })
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayServices = await prisma.service.count({
      where: {
        receivedDate: {
          gte: today
        }
      }
    })

    // Müşteri istatistikleri
    const totalCustomers = await prisma.customer.count()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const newCustomers = await prisma.customer.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Stok istatistikleri
    const totalStock = await prisma.stock.count()
    const lowStock = await prisma.stock.count({
      where: {
        quantity: {
          lte: prisma.stock.fields.minQuantity
        }
      }
    })

    // Finansal istatistikler
    const totalIncomeResult = await prisma.cashTransaction.aggregate({
      where: { type: 'income' },
      _sum: { amount: true }
    })
    const totalIncome = totalIncomeResult._sum.amount || 0

    const totalExpenseResult = await prisma.cashTransaction.aggregate({
      where: { type: 'expense' },
      _sum: { amount: true }
    })
    const totalExpense = totalExpenseResult._sum.amount || 0

    const netProfit = totalIncome - totalExpense

    // Bu ay gelir/gider
    const thisMonthStart = new Date()
    thisMonthStart.setDate(1)
    thisMonthStart.setHours(0, 0, 0, 0)

    const thisMonthIncomeResult = await prisma.cashTransaction.aggregate({
      where: { 
        type: 'income',
        transactionDate: { gte: thisMonthStart }
      },
      _sum: { amount: true }
    })
    const thisMonthIncome = thisMonthIncomeResult._sum.amount || 0

    const thisMonthExpenseResult = await prisma.cashTransaction.aggregate({
      where: { 
        type: 'expense',
        transactionDate: { gte: thisMonthStart }
      },
      _sum: { amount: true }
    })
    const thisMonthExpense = thisMonthExpenseResult._sum.amount || 0

    // Geçen ay gelir
    const lastMonthStart = new Date()
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
    lastMonthStart.setDate(1)
    lastMonthStart.setHours(0, 0, 0, 0)

    const lastMonthEnd = new Date(thisMonthStart.getTime() - 1)

    const lastMonthIncomeResult = await prisma.cashTransaction.aggregate({
      where: { 
        type: 'income',
        transactionDate: { 
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      },
      _sum: { amount: true }
    })
    const lastMonthIncome = lastMonthIncomeResult._sum.amount || 0

    // Son servisler
    const recentServices = await prisma.service.findMany({
      take: 10,
      orderBy: { receivedDate: 'desc' },
      include: {
        customer: true
      }
    })

    const recentServicesData = recentServices.map(service => ({
      id: service.id,
      serviceNo: service.serviceNo,
      customerName: service.customer.name,
      deviceBrand: service.deviceBrand || 'Bilinmiyor',
      deviceType: service.deviceType || 'Bilinmiyor',
      status: service.status,
      totalCost: service.totalCost
    }))

    // En popüler markalar
    const services = await prisma.service.findMany({
      where: {
        deviceBrand: { not: null }
      },
      select: {
        deviceBrand: true
      }
    })

    const brandCounts = services.reduce((acc: Record<string, number>, service) => {
      const brand = service.deviceBrand || 'Bilinmiyor'
      acc[brand] = (acc[brand] || 0) + 1
      return acc
    }, {})

    const topDeviceBrands = Object.entries(brandCounts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Aylık gelir/gider trendi (son 6 ay)
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i)
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)

      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      monthEnd.setDate(0)
      monthEnd.setHours(23, 59, 59, 999)

      const monthIncomeResult = await prisma.cashTransaction.aggregate({
        where: {
          type: 'income',
          transactionDate: { gte: monthStart, lte: monthEnd }
        },
        _sum: { amount: true }
      })

      const monthExpenseResult = await prisma.cashTransaction.aggregate({
        where: {
          type: 'expense',
          transactionDate: { gte: monthStart, lte: monthEnd }
        },
        _sum: { amount: true }
      })

      monthlyRevenue.push({
        month: monthStart.toLocaleString('tr-TR', { month: 'short', year: 'numeric' }),
        income: monthIncomeResult._sum.amount || 0,
        expense: monthExpenseResult._sum.amount || 0
      })
    }

    return NextResponse.json({
      services: {
        total: totalServices,
        pending: pendingServices,
        inProgress: inProgressServices,
        completed: completedServices,
        today: todayServices
      },
      customers: {
        total: totalCustomers,
        new30Days: newCustomers
      },
      stock: {
        total: totalStock,
        lowStock: lowStock
      },
      financial: {
        totalIncome,
        totalExpense,
        netProfit,
        thisMonthIncome,
        thisMonthExpense,
        lastMonthIncome
      },
      recentServices: recentServicesData,
      topDeviceBrands,
      monthlyRevenue
    })
  } catch (error: any) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: error.message || 'Dashboard yüklenemedi' },
      { status: 500 }
    )
  }
}

