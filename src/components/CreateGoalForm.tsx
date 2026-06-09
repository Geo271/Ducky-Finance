// src/app/savings/CreateGoalForm.tsx
'use client'

import { useRef } from 'react'
import toast from 'react-hot-toast'
import SubmitButton from '@/components/SubmitButton'
import { addSavingsGoal } from '@/app/actions/savings'

export default function CreateGoalForm() {
  const formRef = useRef<HTMLFormElement>(null)

  const handleAction = async (formData: FormData) => {
    const result = await addSavingsGoal(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Savings target initialized! 🎉')
      formRef.current?.reset()
    }
  }

  return (
    <form ref={formRef} action={handleAction} className="bg-white p-6 rounded-3xl border border-pink-100/60 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.08)] flex flex-col gap-5 sticky top-6">
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

      <SubmitButton 
        defaultText="Initialize Target"
        loadingText="Initializing..."
        className="mt-2 w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold tracking-wide transition-all shadow-md"
      />
    </form>
  )
}