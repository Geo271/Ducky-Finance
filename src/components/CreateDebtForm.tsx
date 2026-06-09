// src/components/CreateDebtForm.tsx
'use client'

import { useRef } from 'react'
import toast from 'react-hot-toast'
import SubmitButton from '@/components/SubmitButton'
import { addDebtItem } from '@/app/actions/debt'

export default function CreateDebtForm() {
  const formRef = useRef<HTMLFormElement>(null)

  const handleAction = async (formData: FormData) => {
    const result = await addDebtItem(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Liability logged successfully! 💳')
      formRef.current?.reset()
    }
  }

  return (
    <form ref={formRef} action={handleAction} className="bg-white p-6 rounded-3xl border border-pink-100/60 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.08)] flex flex-col gap-4 sticky top-6">
      <h2 className="font-bold text-zinc-800 text-lg mb-1">Log New Account</h2>
      
      <div className="flex flex-col gap-1.5">
        <label htmlFor="creditor_name" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Creditor Name / Platform</label>
        <input type="text" id="creditor_name" name="creditor_name" required placeholder="e.g., SPayLater, Maya Credit" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="total_due" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Total Outstanding Balance (₱)</label>
        <input type="number" id="total_due" name="total_due" step="0.01" required placeholder="3500.00" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all font-medium" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="classification" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Type</label>
          <select id="classification" name="classification" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all appearance-none cursor-pointer">
            <option value="Personal">Personal Dues</option>
            <option value="Other">Commercial App</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="due_date" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Due Date</label>
          <input type="date" id="due_date" name="due_date" required className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all" />
        </div>
      </div>

      <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_installment" name="is_installment" className="w-4 h-4 text-pink-500 border-zinc-300 rounded focus:ring-pink-500 cursor-pointer" />
          <label htmlFor="is_installment" className="text-xs font-bold text-zinc-600 cursor-pointer select-none">Structured Installment Plan</label>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="total_months" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Term Duration (Months)</label>
          <input type="number" id="total_months" name="total_months" min="1" defaultValue="1" className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-200" />
        </div>
      </div>

      {/* Replaced standard button with SubmitButton */}
      <SubmitButton 
        defaultText="Register Balance"
        loadingText="Registering..."
        className="mt-2 w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold tracking-wide transition-all text-sm shadow-sm"
      />
    </form>
  )
}