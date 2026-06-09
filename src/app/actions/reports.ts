// src/app/actions/reports.ts
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getReportData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('cashflow_ledger')
    .select('*')
    .eq('user_id', user.id) // DATA ISOLATION
    .order('transaction_date', { ascending: false })

  if (error) throw new Error(`Failed to fetch report data: ${error.message}`)

  return data || []
}