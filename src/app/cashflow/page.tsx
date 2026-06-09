// src/app/cashflow/page.tsx
import { addTransaction } from '@/app/actions/cashflow'
import Link from 'next/link'
import CategoryInput from '@/components/CategoryInput'
import PayeeInput from '@/components/PayeeInput'

export default function CashflowPage() {
  return (
    <div className="min-h-screen bg-[#FCF8F8] text-zinc-800 p-6 md:p-12 font-sans selection:bg-pink-100 selection:text-pink-900">
      <header className="mb-10 max-w-2xl mx-auto flex flex-col gap-2">
        <Link href="/" className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors uppercase tracking-wider mb-2">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          New <span className="text-pink-500 font-medium">Transaction</span>
        </h1>
        <p className="text-sm text-zinc-400">Log standard incoming funds or track everyday expenses.</p>
      </header>

      <main className="max-w-2xl mx-auto">
        <form action={addTransaction} className="bg-white p-8 rounded-3xl border border-pink-100/60 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.08)] flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Amount (₱)</label>
              <input type="number" id="amount" name="amount" step="0.01" required placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all text-lg font-medium" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="flow_type" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Flow Type</label>
              <select id="flow_type" name="flow_type" className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all text-sm appearance-none cursor-pointer">
                <option value="Expense">Expense (Outgoing)</option>
                <option value="Income">Income (Incoming)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="source" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Account Source</label>
            <select id="source" name="source" className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all text-sm appearance-none cursor-pointer">
              <option value="GCash">GCash</option>
              <option value="Maya">Maya</option>
              <option value="MariBank">MariBank</option>
              <option value="Cash">Physical Cash</option>
              <option value="Beep Card">Beep Card</option>
            </select>
          </div>
       

          <CategoryInput />

             {/* Transaction Date Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="transaction_date" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
              Transaction Date
            </label>
            <input 
              type="date" 
              id="transaction_date" 
              name="transaction_date" 
              required
              defaultValue={new Date().toISOString().split('T')[0]} // Defaults to today's date automatically
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all text-sm"
            />
          </div>
          <PayeeInput />

          <button type="submit" className="mt-4 w-full py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_4px_14px_0_rgba(244,63,94,0.39)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.23)] hover:-translate-y-0.5">
            Log Transaction
          </button>
        </form>
      </main>
    </div>
  )
}