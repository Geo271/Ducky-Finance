// src/app/actions/ledger.ts
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getGlobalLedger() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('cashflow_ledger')
    .select(`
      *,
      savings_goals ( title )
    `)
    .eq('user_id', user.id) // DATA ISOLATION
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch ledger: ${error.message}`)
  
  return data
}