// src/app/debt/page.tsx
import { getDebts, recordDebtPayment, deleteDebt, completeDebt } from '@/app/actions/debt'
import Link from 'next/link'
import CreateDebtForm from '@/components/CreateDebtForm' // 1. Imported your client component

export const revalidate = 0

interface DebtRecord {
  id: string
  creditor_name: string
  total_due: number
  amount_paid: number
  classification: 'Personal' | 'Other'
  due_date: string
  is_installment: boolean
  total_months: number
  remaining_months: number
  status?: string
}

export default async function DebtPage() {
  const debts = await getDebts() as DebtRecord[]
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value)

  // --- OVERALL AGGREGATE CALCULATIONS ---
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Filter out completed debts from the total outstanding math
  const activeDebts = debts.filter(d => d.status !== 'completed')

  const totalGlobalOutstanding = activeDebts.reduce((acc, d) => acc + (d.total_due - d.amount_paid), 0)
  
  // Dynamically isolate any accounts matching "SPay" variations
  const totalSpayOutstanding = activeDebts
    .filter(d => d.creditor_name.toLowerCase().includes('spay'))
    .reduce((acc, d) => acc + (d.total_due - d.amount_paid), 0)

  return (
    <div className="min-h-screen bg-[#FCF8F8] text-zinc-800 p-6 md:p-12 font-sans selection:bg-pink-100 selection:text-pink-900">
      
      <header className="mb-10 max-w-5xl mx-auto flex flex-col gap-2">
        <Link href="/" className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors uppercase tracking-wider mb-2 w-max">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Debt Payoff <span className="text-pink-500 font-medium">Engine</span>
        </h1>
        <p className="text-sm text-zinc-400">Track current platform obligations and process payments with an automatic audit trail.</p>
      </header>

      {/* Overall Liability Summary Row */}
      <section className="max-w-5xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-pink-100/60 shadow-sm flex flex-col justify-between">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Total Active Debt</p>
          <p className="text-3xl font-bold text-zinc-900 mt-2">{formatCurrency(totalGlobalOutstanding)}</p>
          <p className="text-xs text-zinc-400 mt-1">Remaining balance across all active accounts.</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-3xl text-white shadow-md flex flex-col justify-between">
          <p className="text-xs font-bold opacity-80 uppercase tracking-wide">Total SPayLater Outstanding</p>
          <p className="text-3xl font-bold mt-2">{formatCurrency(totalSpayOutstanding)}</p>
          <p className="text-xs opacity-80 mt-1">Sum total of active SPayLater installments.</p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Add Debt */}
        <div className="lg:col-span-1">
          {/* 2. Replaced the old raw <form> with the component */}
          <CreateDebtForm />
        </div>

        {/* Right Content: Active Debt Ledgers */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {debts?.map((debt) => {
            const outstandingRemaining = debt.total_due - debt.amount_paid
            const progressRatio = Math.min((debt.amount_paid / debt.total_due) * 100, 100)
            
            const isSettled = debt.status === 'completed' || outstandingRemaining <= 0 || (debt.is_installment && debt.remaining_months <= 0)

            const currentMonthTerm = debt.total_months - debt.remaining_months + 1
            const calculatedMonthlyInstallment = debt.is_installment ? (debt.total_due / debt.total_months) : outstandingRemaining
            const actualPaymentTarget = Math.min(calculatedMonthlyInstallment, outstandingRemaining)

            // --- TIME PROXIMITY ALERT ENGINE ---
            const targetDueDate = new Date(debt.due_date)
            targetDueDate.setHours(0,0,0,0)
            const differenceInTime = targetDueDate.getTime() - today.getTime()
            const daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24))
            
            const isAlmostDue = !isSettled && daysRemaining <= 5 && daysRemaining >= 0
            const isOverdue = !isSettled && daysRemaining < 0

            return (
              <div key={debt.id} className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row justify-between gap-6 transition-all hover:shadow-md relative overflow-hidden
                ${isAlmostDue ? 'border-amber-200 ring-2 ring-amber-50' : 'border-pink-100/60'}
                ${isOverdue ? 'border-rose-200 ring-2 ring-rose-50' : ''}
                ${isSettled ? 'opacity-70 bg-zinc-50' : ''}
              `}>
                
                {/* Account Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className="font-bold text-zinc-800 text-lg">{debt.creditor_name}</h3>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wide ${isSettled ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                        {isSettled ? 'Settled' : `Due ${new Date(debt.due_date).toLocaleDateString()}`}
                      </span>
                      {debt.is_installment && !isSettled && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-600 rounded-md uppercase tracking-wide">
                          Month {currentMonthTerm} of {debt.total_months}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{debt.classification} Line Account</p>
                  </div>

                  {/* PROACTIVE WARNING NOTIFICATION CONTAINER */}
                  {isAlmostDue && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-amber-800 text-xs font-semibold animate-pulse">
                      <span>⚠️</span>
                      <p>The payment is almost due ({daysRemaining} days left)! Be prepared.</p>
                    </div>
                  )}

                  {isOverdue && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-bold">
                      <span>🚨</span>
                      <p>Account is overdue by {Math.abs(daysRemaining)} days! Clear balance immediately.</p>
                    </div>
                  )}

                  {/* Progress Line */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-semibold text-zinc-500 mb-1">
                      <span>Paid: {formatCurrency(debt.amount_paid)}</span>
                      <span>Total: {formatCurrency(debt.total_due)}</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${isSettled ? 'bg-emerald-400' : isAlmostDue ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${progressRatio}%` }} />
                    </div>
                  </div>

                  {/* ARCHIVE & DELETE CONTROL BAR */}
                  <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                    {isSettled ? (
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                        ✓ Completed
                      </span>
                    ) : (
                      <form action={completeDebt}>
                        <input type="hidden" name="id" value={debt.id} />
                        <button type="submit" className="text-[10px] font-bold text-zinc-500 hover:text-emerald-600 transition-colors uppercase tracking-wider px-2 py-1 bg-zinc-50 hover:bg-emerald-50 rounded-md border border-zinc-200/60">
                          Mark Settled
                        </button>
                      </form>
                    )}

                    <form action={deleteDebt}>
                      <input type="hidden" name="id" value={debt.id} />
                      <button type="submit" className="text-[10px] font-bold text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-wider px-2 py-1 bg-rose-50/50 hover:bg-rose-100 rounded-md">
                        Disregard
                      </button>
                    </form>
                  </div>
                </div>

                {/* Direct Action Box */}
                {!isSettled && (
                  <form action={recordDebtPayment} className="w-full md:w-52 p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100 flex flex-col gap-3 justify-center">
                    <input type="hidden" name="debt_id" value={debt.id} />
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                        {debt.is_installment ? 'Next Installment Due' : 'Quick Pay Down'}
                      </p>
                      <p className="text-sm font-bold text-zinc-700 mt-0.5">
                        {formatCurrency(actualPaymentTarget)}
                      </p>
                    </div>
                    
                    <input type="hidden" name="amount" value={actualPaymentTarget.toFixed(2)} />
                    
                    <select name="source" required className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[11px] appearance-none cursor-pointer focus:outline-none">
                      <option value="GCash">From GCash</option>
                      <option value="Maya">From Maya</option>
                      <option value="MariBank">From MariBank</option>
                      <option value="Cash">From Cash</option>
                    </select>
                    <button type="submit" className={`w-full py-2 text-white font-bold text-xs rounded-lg transition-colors shadow-sm
                      ${isAlmostDue ? 'bg-amber-500 hover:bg-amber-600' : 'bg-pink-500 hover:bg-pink-600'}
                    `}>
                      {debt.is_installment ? 'Pay Current Month' : 'Deduct Balance'}
                    </button>
                  </form>
                )}
              </div>
            )
          })}

          {(!debts || debts.length === 0) && (
            <div className="p-12 text-center border-2 border-dashed border-pink-100 bg-white/50 rounded-3xl text-zinc-400 text-sm">
               No liability statements logged. Your debt dashboard is currently completely clean! ✨
            </div>
          )}
        </div>
      </main>
    </div>
  )
}