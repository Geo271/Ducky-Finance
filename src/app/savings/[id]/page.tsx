// src/app/savings/[id]/page.tsx
import { getSavingsGoalDetails, addDirectDeposit, inviteCollaborator } from '@/app/actions/savings'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const revalidate = 0

interface Transaction {
  id: string;
  description: string;
  source: string;
  amount: number;
  created_at: string;
  actor_email?: string; // NEW: Added this property
}

export default async function GoalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  // Fetch current user session to display at the top
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserEmail = user?.email

  const { goal, history, collaborators } = await getSavingsGoalDetails(resolvedParams.id)

  // 1. ADD THIS SAFETY CHECK:
  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-800">Goal Not Found</h1>
          <p className="text-zinc-500 mt-2">The goal you are trying to view does not exist or you do not have permission to see it.</p>
          <Link href="/savings" className="mt-4 inline-block text-pink-500 font-bold underline">
            ← Back to Savings
          </Link>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value)
  const progress = goal.target_amount === 0 ? 0 : Math.min((goal.current_amount / goal.target_amount) * 100, 100)

  return (
    <div className="min-h-screen bg-[#FCF8F8] text-zinc-800 p-6 md:p-12 font-sans selection:bg-pink-100 selection:text-pink-900">
      <header className="mb-10 max-w-5xl mx-auto flex flex-col gap-2 relative">
        <Link href="/savings" className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors uppercase tracking-wider mb-2 w-max">
          ← Back to Goals
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{goal.title}</h1>
            {goal.is_emergency && (
              <span className="px-3 py-1 text-[10px] font-bold bg-pink-100 text-pink-600 rounded-lg uppercase tracking-tight">Emergency Fund</span>
            )}
          </div>
          
          {/* NEW: Identity Badge */}
          <div className="bg-white border border-pink-100 px-4 py-2 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Currently Logged In As</p>
            <p className="text-xs font-bold text-pink-500">{currentUserEmail}</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Progress & Deposit Form */}
        <div className="md:col-span-1 flex flex-col gap-6">
          
          {/* Progress Overview */}
          <div className="bg-white p-8 rounded-3xl border border-pink-100/60 shadow-sm">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-6">Target Progress</h2>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-zinc-900 tracking-tight">{formatCurrency(goal.current_amount)}</p>
              <p className="text-sm text-zinc-400 mt-1">of {formatCurrency(goal.target_amount)}</p>
            </div>
            
            <div className="relative h-4 w-full bg-zinc-100 rounded-full overflow-hidden mb-4">
              <div 
                className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${progress >= 100 ? 'bg-emerald-400' : 'bg-pink-400'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={`text-center font-bold text-sm ${progress >= 100 ? 'text-emerald-500' : 'text-pink-500'}`}>
              {progress.toFixed(1)}% Completed
            </p>
          </div>

          {/* Collaborators Module */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100/60 shadow-sm">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-4">Collaborators</h2>
            <div className="space-y-2 mb-4">
              {collaborators?.map((c: any) => (
                <div key={c.user_email} className="text-xs font-medium text-zinc-600 bg-zinc-50 p-2 rounded-lg flex items-center gap-2 border border-zinc-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> 
                  {c.user_email}
                </div>
              ))}
              {(!collaborators || collaborators.length === 0) && (
                <p className="text-xs text-zinc-400 italic">No partners invited yet.</p>
              )}
            </div>
            <form action={inviteCollaborator} className="flex flex-col gap-2">
              <input type="hidden" name="goal_id" value={goal.id} />
              <input name="email" type="email" required placeholder="Partner's email" className="w-full px-4 py-2.5 bg-zinc-50/50 text-xs font-medium border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200" />
              <button type="submit" className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 transition-colors text-white rounded-xl text-xs font-bold tracking-wide shadow-sm">
                Invite Partner
              </button>
            </form>
          </div>

          {/* Quick Deposit Form */}
          <form action={addDirectDeposit} className="bg-white p-6 rounded-3xl border border-pink-100/60 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.08)] flex flex-col gap-4">
            <h2 className="font-bold text-zinc-800 text-lg mb-2">Quick Deposit</h2>
            <input type="hidden" name="savings_goal_id" value={goal.id} />
            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Amount (₱)</label>
              <input type="number" id="amount" name="amount" step="0.01" required placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-medium" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="source" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Fund Source</label>
              <select id="source" name="source" className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all text-sm appearance-none cursor-pointer">
                <option value="GCash">GCash</option>
                <option value="Maya">Maya</option>
                <option value="MariBank">MariBank</option>
                <option value="Cash">Physical Cash</option>
              </select>
            </div>
            <button type="submit" className="mt-2 w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold tracking-wide transition-all shadow-md">
              Add Funds
            </button>
          </form>

        </div>

        {/* Right Column: Income History Ledger */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Contribution History</h2>
          
          <div className="bg-white rounded-3xl border border-pink-100/60 shadow-sm overflow-hidden">
            {(!history || history.length === 0) ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <span className="text-2xl mb-2">💸</span>
                <p className="text-zinc-600 font-bold text-sm">No transactions yet.</p>
                <p className="text-zinc-400 text-xs mt-1">Funds added will appear here with an audit trail.</p>
              </div>
            ) : (
              <div className="divide-y divide-pink-50">
                {history?.map((tx: Transaction) => (
                  <div key={tx.id} className="p-5 flex justify-between items-center hover:bg-pink-50/30 transition-colors">
                    <div>
                      {/* NEW: Displays WHO made the deposit */}
                      <p className="font-semibold text-zinc-800">
                        {tx.description} 
                        <span className="text-[10px] ml-2 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 font-medium tracking-wide">
                          by {tx.actor_email || 'Original Creator'}
                        </span>
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        Via {tx.source} • {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">+{formatCurrency(tx.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}