// src/app/actions/financials.ts
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDashboardMetrics() {
  const supabase = await createClient()
  
  // 1. SECURE: Identify the current logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // 2. Fetch Cashflow (Income & Expenses) securely
  const { data: cashflow, error: cashflowError } = await supabase
    .from('cashflow_ledger')
    .select('amount, flow_type, transaction_date, created_at')
    .eq('user_id', user.id)

  if (cashflowError) console.error('Cashflow Error:', cashflowError.message)

  // 3. Fetch Debts securely
  const { data: debts, error: debtError } = await supabase
    .from('debt_ledger')
    .select('total_due, amount_paid, status')
    .eq('user_id', user.id)

  if (debtError) console.error('Debt Error:', debtError.message)

  // 4. Fetch Savings securely
  const { data: savings, error: savingsError } = await supabase
    .from('savings_goals')
    .select('current_amount')
    .eq('user_id', user.id)

  if (savingsError) console.error('Savings Error:', savingsError.message)

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  let totalIncome = 0
  let totalExpenses = 0

  // Only calculate cashflow for the CURRENT MONTH
  cashflow?.forEach(tx => {
    // Note: Assuming you have 'transaction_date' or 'created_at'. Using created_at as a safe fallback.
    const txDate = new Date(tx.transaction_date || tx.created_at) 
    
    if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
      if (tx.flow_type === 'Income') {
        totalIncome += Number(tx.amount)
      } else {
        totalExpenses += Number(tx.amount)
      }
    }
  })

  // Debt remains cumulative across all months
  let totalDebt = 0
  debts?.forEach(d => {
    if (d.status !== 'completed') {
      const remaining = Number(d.total_due) - Number(d.amount_paid)
      if (remaining > 0) totalDebt += remaining
    }
  })

  // Savings remain cumulative across all months
  let totalSavings = 0
  savings?.forEach(s => {
    totalSavings += Number(s.current_amount)
  })

  // Spendable liquid money is Current Month Income minus Current Month Expenses
  const totalMoney = totalIncome - totalExpenses

  return {
    totalMoney,
    totalSavings,
    totalExpenses,
    totalDebt
  }
}