// src/app/page.tsx
import { getDashboardMetrics } from './actions/financials'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FinBot from '@/components/FinBot'
import { resetAccountData } from '@/app/actions/settings'
import ResetButton from '@/components/ResetButton' // Import your new component
import { getNotifications } from './actions/notification'
import NotificationBell from '@/components/NotificationBell'

export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()
  const notifications = await getNotifications()
  
  // Security Guard: Kick unauthenticated sessions to the login screen
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let metrics = { totalMoney: 0, totalSavings: 0, totalDebt: 0, totalExpenses: 0 }
  let errorMsg = ''

  try {
    metrics = await getDashboardMetrics()
  } catch (err) {
    errorMsg = 'Failed to load user financial metrics safely.'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value)
  }

  return (
    <div className="min-h-screen bg-[#FAF6F6] text-zinc-800 p-4 sm:p-6 md:p-12 font-sans relative overflow-hidden pb-24">
      
      {/* Background Gradients Accent Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-pink-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-rose-200/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Header Row */}
      <header className="mb-10 max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-30">
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
      Ducky <span className="text-pink-500 font-medium">Finance</span>
    </h1>
    <p className="text-sm text-zinc-400 font-medium tracking-wide uppercase mt-1 text-[10px]">
      Personal Wealth Ledger & Automated Analytics
    </p>
  </div>

  {/* NEW USER PROFILE SECTION */}
  <div className="flex items-center gap-3 bg-white p-2 pl-4 rounded-2xl border border-pink-100 shadow-sm">
    <div className="hidden sm:block text-right">
      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Active Workspace</p>
      <p className="text-xs font-bold text-zinc-800">{user?.email}</p>
    </div>

    <NotificationBell initialNotifications={notifications} />
    
    <div className="h-8 w-px bg-zinc-100 hidden sm:block"></div>

    <div className="flex items-center gap-2">
      <form action={resetAccountData}>
        <ResetButton /> 
      </form>

      {/* Make sure your signOut action path matches exactly where your current sign out function lives */}
      <form action="/auth/signout" method="post">
        <button type="submit" className="text-[10px] font-bold text-zinc-500 bg-zinc-50 hover:bg-zinc-900 hover:text-white transition-colors uppercase tracking-wider px-3 py-2 rounded-xl">
          Sign Out
        </button>
      </form>
    </div>
  </div>
</header>

      {errorMsg && (
        <div className="max-w-6xl mx-auto mb-8 p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl text-sm shadow-xs relative z-10">
          {errorMsg}
        </div>
      )}

      <main className="max-w-6xl mx-auto relative z-10 space-y-6 md:space-y-10">
        
        {/* FIXED: High-Fidelity Responsive Metrics Matrix. 2x2 layout on mobile, 1x4 layout on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          
          {/* Total Money Card */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-zinc-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Money</p>
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight truncate">
                {formatCurrency(metrics.totalMoney)}
              </p>
            </div>
            <p className="mt-2 text-[10px] md:text-xs text-zinc-400 font-medium leading-relaxed hidden sm:block">
              Liquid spendable balance across active platforms.
            </p>
          </div>

          {/* Total Savings Card */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-zinc-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Savings</p>
                <span className="px-1.5 py-0.5 text-[8px] font-bold bg-pink-50 text-pink-500 rounded-md uppercase tracking-wider border border-pink-100/40">
                  15% Split
                </span>
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-pink-500 tracking-tight truncate">
                {formatCurrency(metrics.totalSavings)}
              </p>
            </div>
            <p className="mt-2 text-[10px] md:text-xs text-zinc-400 font-medium leading-relaxed hidden sm:block">
              Locked funds split across custom savings targets.
            </p>
          </div>

          {/* Total Expenses Card */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-zinc-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Expenses</p>
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-800 tracking-tight truncate">
                {formatCurrency(metrics.totalExpenses)}
              </p>
            </div>
            <p className="mt-2 text-[10px] md:text-xs text-zinc-400 font-medium leading-relaxed hidden sm:block">
              Cumulative monthly expenditures and tracking.
            </p>
          </div>

          {/* Total Debt Card */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-zinc-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Debt</p>
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-400" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-rose-500 tracking-tight truncate">
                {formatCurrency(metrics.totalDebt)}
              </p>
            </div>
            <p className="mt-2 text-[10px] md:text-xs text-zinc-400 font-medium leading-relaxed hidden sm:block">
              Outstanding dues across accounts and platforms.
            </p>
          </div>

        </div>

        {/* Modular Workflow Navigation Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          
          <Link href="/cashflow" className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-100 shadow-xs flex flex-col justify-between h-32 sm:h-36 transition-all hover:border-pink-200 hover:shadow-md group">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-zinc-800 group-hover:text-pink-500 transition-colors">Cashflow Ledger</h3>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-1 leading-snug line-clamp-2 hidden sm:block">Log incoming funds and track daily expenditures.</p>
            </div>
            <span className="text-[9px] font-bold tracking-wider text-pink-500 uppercase flex items-center gap-1">Log Entry →</span>
          </Link>

          <Link href="/savings" className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-100 shadow-xs flex flex-col justify-between h-32 sm:h-36 transition-all hover:border-pink-200 hover:shadow-md group">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-zinc-800 group-hover:text-pink-500 transition-colors">Savings Targets</h3>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-1 leading-snug line-clamp-2 hidden sm:block">Monitor your goals and manage automated split settings.</p>
            </div>
            <span className="text-[9px] font-bold tracking-wider text-pink-500 uppercase flex items-center gap-1">Goals →</span>
          </Link>

          <Link href="/ledger" className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-100 shadow-xs flex flex-col justify-between h-32 sm:h-36 transition-all hover:border-pink-200 hover:shadow-md group">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-zinc-800 group-hover:text-pink-500 transition-colors">Global Ledger</h3>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-1 leading-snug line-clamp-2 hidden sm:block">Master timeline log covering entire transaction histories.</p>
            </div>
            <span className="text-[9px] font-bold tracking-wider text-pink-500 uppercase flex items-center gap-1">History →</span>
          </Link>

          <Link href="/debt" className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-100 shadow-xs flex flex-col justify-between h-32 sm:h-36 transition-all hover:border-pink-200 hover:shadow-md group">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-zinc-800 group-hover:text-pink-500 transition-colors">Debt Management</h3>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-1 leading-snug line-clamp-2 hidden sm:block">Isolate personal balances from active installment plans.</p>
            </div>
            <span className="text-[9px] font-bold tracking-wider text-pink-500 uppercase flex items-center gap-1">Dues →</span>
          </Link>

          <Link href="/reports" className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-100 shadow-xs flex flex-col justify-between h-32 sm:h-36 transition-all hover:border-pink-200 hover:shadow-md group">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-zinc-800 group-hover:text-pink-500 transition-colors">Analytics Reports</h3>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-1 leading-snug line-clamp-2 hidden sm:block">Review categorical totals or print-optimize financial summaries.</p>
            </div>
            <span className="text-[9px] font-bold tracking-wider text-pink-500 uppercase flex items-center gap-1">Insights →</span>
          </Link>

          <Link href="/calendar" className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-100 shadow-xs flex flex-col justify-between h-32 sm:h-36 transition-all hover:border-pink-200 hover:shadow-md group">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-zinc-800 group-hover:text-pink-500 transition-colors">Financial Calendar</h3>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-1 leading-snug line-clamp-2 hidden sm:block">Calendar view integrated with billing dates and personal memos.</p>
            </div>
            <span className="text-[9px] font-bold tracking-wider text-pink-500 uppercase flex items-center gap-1">Schedule →</span>
          </Link>

        </div>
      </main>

      <FinBot metrics={metrics} />
    </div>
  )
}