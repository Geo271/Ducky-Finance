// src/app/actions/debt.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getDebts() {
  const supabase = await createClient()
  
  // SECURE: Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('debt_ledger')
    .select('*')
    .eq('user_id', user.id) // DATA ISOLATION
    .order('due_date', { ascending: true })

  if (error) throw new Error(`Failed to load debts: ${error.message}`)
  return data || []
}

export async function addDebtItem(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
 if (!user) return { error: 'Not authenticated' }

  const creditor_name = formData.get('creditor_name') as string
  const total_due = Number(formData.get('total_due'))
  const classification = formData.get('classification') as string
  const due_date = formData.get('due_date') as string
  const is_installment = formData.get('is_installment') === 'on'
  const total_months = is_installment ? Number(formData.get('total_months')) : 1

  const { error } = await supabase
    .from('debt_ledger')
    .insert([{ 
      creditor_name, 
      total_due, 
      amount_paid: 0, 
      classification, 
      due_date,
      is_installment,
      total_months,
      remaining_months: total_months,
      user_id: user.id // DATA ISOLATION
    }])

  if (error) return { error: error.message }

  revalidatePath('/debt')
  revalidatePath('/')
  return { success: true }
}

export async function recordDebtPayment(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const id = formData.get('debt_id') as string
  const payment_amount = Number(formData.get('amount'))
  const source = formData.get('source') as string

  // Ensure user owns this debt before paying
  const { data: debt } = await supabase.from('debt_ledger').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!debt) throw new Error('Debt account entry missing or unauthorized.')

  const calculatedPaid = Number(debt.amount_paid) + payment_amount
  const updatedRemainingMonths = debt.is_installment && debt.remaining_months > 0
    ? debt.remaining_months - 1 
    : debt.remaining_months

  await supabase
    .from('debt_ledger')
    .update({ 
      amount_paid: calculatedPaid,
      remaining_months: updatedRemainingMonths
    })
    .eq('id', id)
    .eq('user_id', user.id)

  await supabase.from('cashflow_ledger').insert([{
    amount: payment_amount,
    flow_type: 'Expense',
    source,
    routing_category: 'Expense',
    description: debt.is_installment 
      ? `Installment Pay: ${debt.creditor_name} (${debt.total_months - updatedRemainingMonths}/${debt.total_months})`
      : `Paid: ${debt.creditor_name}`,
    payee: debt.creditor_name,
    user_id: user.id // DATA ISOLATION
  }])

  revalidatePath('/debt')
  revalidatePath('/ledger')
  revalidatePath('/reports')
  revalidatePath('/')
}

export async function deleteDebt(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('debt_ledger')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error('Failed to delete debt')
  revalidatePath('/debt')
}

export async function completeDebt(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('debt_ledger')
    .update({ status: 'completed' })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error('Failed to complete debt')
  revalidatePath('/debt')
}