// src/app/savings/page.tsx
import { getSavingsGoals, addSavingsGoal, completeSavingsGoal, deleteSavingsGoal } from '@/app/actions/savings'
import Link from 'next/link'

export const revalidate = 0

export default async function SavingsPage() {
  const goals = await getSavingsGoals()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value)
  }

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0
    const percent = (current / target) * 100
    return percent > 100 ? 100 : percent
  }

  return (
    <div className="min-h-screen bg-[#FCF8F8] text-zinc-800 p-6 md:p-12 font-sans selection:bg-pink-100 selection:text-pink-900">
      
      <header className="mb-10 max-w-5xl mx-auto flex flex-col gap-2">
        <Link href="/" className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors uppercase tracking-wider mb-2 w-max">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Savings <span className="text-pink-500 font-medium">Targets</span>
        </h1>
        <p className="text-sm text-zinc-400">Track your goals and monitor automated database distributions.</p>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create New Goal Form */}
        <div className="lg:col-span-1 h-max">
          <form action={addSavingsGoal} className="bg-white p-6 rounded-3xl border border-pink-100/60 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.08)] flex flex-col gap-5 sticky top-6">
            <h2 className="font-bold text-zinc-800 text-lg mb-2">Create New Goal</h2>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Goal Name</label>
              <input type="text" id="title" name="title" required placeholder="e.g., Japan Trip 2027" className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="target_amount" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Target Amount (₱)</label>
              <input type="number" id="target_amount" name="target_amount" step="0.01" required placeholder="50000" className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="target_date" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Target Date</label>
              <input type="date" id="target_date" name="target_date" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all" />
            </div>

            <div className="flex items-center gap-3 mt-2 p-3 rounded-xl bg-pink-50/50 border border-pink-100">
              <input type="checkbox" id="is_emergency" name="is_emergency" className="w-4 h-4 text-pink-500 border-zinc-300 rounded focus:ring-pink-500 cursor-pointer" />
              <label htmlFor="is_emergency" className="text-xs font-medium text-pink-800 cursor-pointer">
                Set as Emergency Fund (Trigger 15% Auto-Routing)
              </label>
            </div>

            <button type="submit" className="mt-2 w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold tracking-wide transition-all shadow-md">
              Initialize Target
            </button>
          </form>
        </div>

        {/* Right Column: Interactive Trackers */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {goals?.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount)
            const isCompletedMath = progress >= 100
            const isSettled = goal.status === 'completed' || isCompletedMath
            
            return (
             <div key={goal.id} className={`group relative bg-white p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md overflow-hidden block
                ${isSettled ? 'opacity-80 border-emerald-100/60 bg-emerald-50/10' : 'border-pink-100/60 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.08)]'}
             `}>
                
                {/* Visual Completion Background Glow */}
                {isSettled && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-transparent pointer-events-none" />
                )}

                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-zinc-800">{goal.title}</h3>
                      {goal.is_emergency && !isSettled && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-600 rounded-md uppercase tracking-tight">Auto-Route Active</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">Target Date: {new Date(goal.target_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-900">{formatCurrency(goal.current_amount)}</p>
                    <p className="text-xs text-zinc-400">of {formatCurrency(goal.target_amount)}</p>
                  </div>
                </div>

                {/* Interactive Progress Bar */}
                <div className="relative h-4 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${isSettled ? 'bg-emerald-400' : 'bg-pink-400'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Data Insights */}
                <div className="mt-4 flex justify-between items-center text-xs transition-opacity">
                  <span className={`font-bold ${isSettled ? 'text-emerald-500' : 'text-pink-500'}`}>
                    {progress.toFixed(1)}% Completed
                  </span>
                  <span className="text-zinc-500 font-medium">
                    {isSettled ? 'Target Reached! 🎉' : `${formatCurrency(goal.target_amount - goal.current_amount)} remaining`}
                  </span>
                </div>

                {/* NEW: ARCHIVE & DELETE CONTROL BAR */}
                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between gap-2 relative z-20">
                  <div className="flex gap-2">
                    {isSettled ? (
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                        ✓ Completed
                      </span>
                    ) : (
                      <form action={completeSavingsGoal}>
                        <input type="hidden" name="id" value={goal.id} />
                        <button type="submit" className="text-[10px] font-bold text-zinc-500 hover:text-emerald-600 transition-colors uppercase tracking-wider px-2 py-1 bg-zinc-50 hover:bg-emerald-50 rounded-md border border-zinc-200/60">
                          Mark Complete
                        </button>
                      </form>
                    )}

                    <form action={deleteSavingsGoal}>
                      <input type="hidden" name="id" value={goal.id} />
                      <button type="submit" className="text-[10px] font-bold text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-wider px-2 py-1 bg-rose-50/50 hover:bg-rose-100 rounded-md">
                        Delete
                      </button>
                    </form>
                  </div>

                  <Link href={`/savings/${goal.id}`} className="text-[10px] font-bold text-pink-500 hover:text-white transition-colors uppercase tracking-wider px-3 py-1.5 bg-pink-50 hover:bg-pink-500 rounded-md border border-pink-100 hover:border-pink-500 shadow-sm">
                    View Details →
                  </Link>
                </div>
                {/* END CONTROL BAR */}

              </div>
            )
          })}
          
          {(!goals || goals.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center border-2 border-dashed border-pink-200 rounded-3xl bg-white/50">
              <span className="text-3xl mb-2">🎯</span>
              <h3 className="text-zinc-700 font-bold">No targets found</h3>
              <p className="text-zinc-400 text-sm mt-1">Create your first savings goal to start tracking.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}