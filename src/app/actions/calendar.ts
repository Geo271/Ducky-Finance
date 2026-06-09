// src/app/actions/calendar.ts
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getCalendarEvents() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Filter both queries by user_id
  const { data: debts } = await supabase.from('debt_ledger').select('id, creditor_name, due_date, total_due, amount_paid').eq('user_id', user.id)
  
  const { data: savings } = await supabase.from('savings_goals').select('id, title, target_date, target_amount, current_amount').eq('user_id', user.id)

  const events: Array<{ id: string; date: string; label: string; type: 'debt' | 'savings' }> = []

  debts?.forEach(d => {
    if (d.total_due - d.amount_paid > 0) {
      events.push({
        id: d.id,
        date: d.due_date,
        label: `🚨 Bill Due: ${d.creditor_name}`,
        type: 'debt'
      })
    }
  })

  savings?.forEach(s => {
    if (s.current_amount < s.target_amount) {
      events.push({
        id: s.id,
        date: s.target_date,
        label: `🎯 Target: ${s.title}`,
        type: 'savings'
      })
    }
  })

  return events
}