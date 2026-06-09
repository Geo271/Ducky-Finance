// src/app/actions/cashflow.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTransaction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const amount = Number(formData.get('amount'))
  const flow_type = formData.get('flow_type') as string
  const source = formData.get('source') as string
  const description = formData.get('description') as string
  const payee = formData.get('payee') as string
  const transaction_date = formData.get('transaction_date') as string
  
  const routing_category = flow_type === 'Expense' ? 'Expense' : 'Specific Person'

  const { error } = await supabase
    .from('cashflow_ledger')
    .insert([{ 
      amount, 
      flow_type, 
      source, 
      routing_category, 
      description, 
      payee: payee || null,
      transaction_date: transaction_date || new Date().toISOString().split('T')[0],
      savings_goal_id: null,
      user_id: user.id // DATA ISOLATION
    }])

  if (error) {
    throw new Error(`Failed to log transaction: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/ledger')
  revalidatePath('/reports')
}