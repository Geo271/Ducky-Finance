// src/app/reports/page.tsx
import { getReportData } from '@/app/actions/reports'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton' // <-- Import the new Client Component

export const revalidate = 0

// Strict interface to prevent TypeScript errors
interface TransactionRecord {
  id: string
  amount: number
  flow_type: 'Income' | 'Expense'
  description: string
  transaction_date: string
  created_at: string
}

export default async function ReportsPage() {
  const data = await getReportData()
  const transactions = data as TransactionRecord[]

  // --- TIME & DATA CALCULATION LOGIC ---
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(now.getDate() - 7)

  let summary = {
    weekly: { income: 0, expense: 0 },
    monthly: { income: 0, expense: 0 },
    yearly: { income: 0, expense: 0 }
  }

  // Dynamic grouping for the current month's categories
  const categoryBreakdown = {
    income: {} as Record<string, number>,
    expense: {} as Record<string, number>
  }

  transactions.forEach((tx) => {
    const txDate = new Date(tx.transaction_date || tx.created_at)
    const isIncome = tx.flow_type === 'Income'
    const amount = Number(tx.amount)

    // Yearly Match
    if (txDate.getFullYear() === currentYear) {
      isIncome ? summary.yearly.income += amount : summary.yearly.expense += amount
    }

    // Monthly Match & Category Sorting
    if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
      isIncome ? summary.monthly.income += amount : summary.monthly.expense += amount
      
      // Dynamically sum up amounts per category
      if (isIncome) {
        categoryBreakdown.income[tx.description] = (categoryBreakdown.income[tx.description] || 0) + amount
      } else {
        categoryBreakdown.expense[tx.description] = (categoryBreakdown.expense[tx.description] || 0) + amount
      }
    }

    // Weekly Match (Last 7 Days)
    if (txDate >= oneWeekAgo) {
      isIncome ? summary.weekly.income += amount : summary.weekly.expense += amount
    }
  })

  const monthlyRemaining = summary.monthly.income - summary.monthly.expense
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value)

  return (
    <div className="min-h-screen bg-[#FCF8F8] text-zinc-800 p-6 md:p-12 font-sans selection:bg-pink-100 selection:text-pink-900">
      
      {/* Header (Hidden when printing) */}
      <header className="mb-10 max-w-5xl mx-auto flex flex-col gap-2 print:hidden">
        <Link href="/" className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors uppercase tracking-wider mb-2 w-max">
          ← Back to Dashboard
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Analytics & <span className="text-pink-500 font-medium">Reports</span>
            </h1>
            <p className="text-sm text-zinc-400">Your financial footprint and category breakdowns.</p>
          </div>
          
          {/* Use the new Client Component here */}
          <PrintButton />
          
        </div>
      </header>

      {/* Main Report Container */}
      <main className="max-w-5xl mx-auto flex flex-col gap-8 print:bg-white print:p-8 print:rounded-none">
        
        {/* Printable Header */}
        <div className="hidden print:block mb-8 border-b border-pink-100 pb-6">
          <h1 className="text-3xl font-bold text-zinc-900">JenJen Finance Summary</h1>
          <p className="text-zinc-500">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Top Section: Net Monthly Status */}
        <div className="bg-white p-8 rounded-3xl border border-pink-100/60 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.08)] text-center">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Total Net Money This Month</h2>
          <p className={`text-5xl md:text-6xl font-bold tracking-tight ${monthlyRemaining >= 0 ? 'text-zinc-900' : 'text-rose-500'}`}>
            {formatCurrency(monthlyRemaining)}
          </p>
          <p className="text-sm text-zinc-400 mt-3">Calculated from all registered income minus all registered expenses.</p>
        </div>

        {/* Middle Section: Dynamic Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Income Categories Table */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100/60 shadow-sm">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-4">Where Money Came From (Income)</h2>
            <div className="divide-y divide-zinc-50">
              {Object.keys(categoryBreakdown.income).length === 0 ? (
                <p className="text-sm text-zinc-400 py-4 text-center">No income recorded this month.</p>
              ) : (
                Object.entries(categoryBreakdown.income)
                  .sort(([, a], [, b]) => b - a) 
                  .map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center py-3">
                      <span className="text-sm font-medium text-zinc-700">{category}</span>
                      <span className="text-sm font-bold text-emerald-500">+{formatCurrency(amount)}</span>
                    </div>
                  ))
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-400 uppercase">Total Income</span>
              <span className="font-bold text-zinc-900">{formatCurrency(summary.monthly.income)}</span>
            </div>
          </div>

          {/* Expense Categories Table */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100/60 shadow-sm">
            <h2 className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-4">Where Money Went (Expenses)</h2>
            <div className="divide-y divide-zinc-50">
              {Object.keys(categoryBreakdown.expense).length === 0 ? (
                <p className="text-sm text-zinc-400 py-4 text-center">No expenses recorded this month.</p>
              ) : (
                Object.entries(categoryBreakdown.expense)
                  .sort(([, a], [, b]) => b - a) 
                  .map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center py-3">
                      <span className="text-sm font-medium text-zinc-700">{category}</span>
                      <span className="text-sm font-bold text-rose-500">-{formatCurrency(amount)}</span>
                    </div>
                  ))
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-400 uppercase">Total Expenses</span>
              <span className="font-bold text-zinc-900">{formatCurrency(summary.monthly.expense)}</span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Accumulation Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Weekly Summary */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100/60 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-zinc-800 mb-1">Past 7 Days</h3>
              <p className="text-xs text-zinc-400 mb-6">Rolling weekly accumulation</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-50">
                <span className="text-sm text-zinc-500">Income</span>
                <span className="font-bold text-emerald-500">+{formatCurrency(summary.weekly.income)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-50">
                <span className="text-sm text-zinc-500">Expenses</span>
                <span className="font-bold text-rose-500">-{formatCurrency(summary.weekly.expense)}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-bold text-zinc-400 uppercase">Net Flow</span>
                <span className="font-bold text-zinc-900">{formatCurrency(summary.weekly.income - summary.weekly.expense)}</span>
              </div>
            </div>
          </div>

          {/* Yearly Summary */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100/60 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-zinc-800 mb-1">{currentYear} Year-to-Date</h3>
              <p className="text-xs text-zinc-400 mb-6">Annual financial footprint</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-50">
                <span className="text-sm text-zinc-500">Income</span>
                <span className="font-bold text-emerald-500">+{formatCurrency(summary.yearly.income)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-50">
                <span className="text-sm text-zinc-500">Expenses</span>
                <span className="font-bold text-rose-500">-{formatCurrency(summary.yearly.expense)}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-bold text-zinc-400 uppercase">Net Flow</span>
                <span className="font-bold text-zinc-900">{formatCurrency(summary.yearly.income - summary.yearly.expense)}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}