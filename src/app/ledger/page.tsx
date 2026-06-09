// src/app/ledger/page.tsx
import { getGlobalLedger } from '@/app/actions/ledger'
import Link from 'next/link'

export const revalidate = 0

interface TransactionRecord {
  id: string
  amount: number
  flow_type: 'Income' | 'Expense'
  source: string
  description: string
  payee: string | null
  routing_category: string
  created_at: string
  savings_goals?: { title: string } | null
}

export default async function LedgerPage() {
  const transactions = await getGlobalLedger() as TransactionRecord[]

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value)

  return (
    <div className="min-h-screen bg-[#FCF8F8] text-zinc-800 p-6 md:p-12 font-sans selection:bg-pink-100 selection:text-pink-900">
      <header className="mb-10 max-w-4xl mx-auto flex flex-col gap-2">
        <Link href="/" className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors uppercase tracking-wider mb-2 w-max">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Global <span className="text-pink-500 font-medium">Ledger</span>
        </h1>
        <p className="text-sm text-zinc-400">A complete master log of all incoming funds, outgoing expenses, savings transfers, and debt payments.</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl border border-pink-100/60 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.08)] overflow-hidden">
          {(!transactions || transactions.length === 0) ? (
            <div className="p-12 text-center text-zinc-400">No transactions recorded yet.</div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {transactions.map((tx) => {
                const isIncome = tx.flow_type === 'Income'
                const isSavingsTransfer = tx.routing_category === 'Savings'

                return (
                  <div key={tx.id} className="p-6 flex justify-between items-center hover:bg-pink-50/30 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm
                        ${isSavingsTransfer ? 'bg-blue-100 text-blue-600' : isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}
                      `}>
                        {isSavingsTransfer ? '🏦' : isIncome ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-800 text-base">
                          {tx.description}
                          {tx.savings_goals?.title && <span className="ml-2 text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full uppercase tracking-wider">→ {tx.savings_goals.title}</span>}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          {new Date(tx.created_at).toLocaleDateString()} • {tx.source} 
                          {tx.payee && ` • ${tx.payee}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-bold text-lg ${isSavingsTransfer ? 'text-blue-600' : isIncome ? 'text-emerald-600' : 'text-zinc-800'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wide mt-1">
                        {isSavingsTransfer ? 'Transfer' : tx.flow_type}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}