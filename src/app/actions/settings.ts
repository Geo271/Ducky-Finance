// src/app/actions/settings.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function resetAccountData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Because of RLS, you can safely issue a delete command and it will ONLY wipe this specific user's rows.
  // Deleting goals will also automatically delete the connected transactions due to the ON DELETE CASCADE we set up earlier!
  await supabase.from('cashflow_ledger').delete().eq('user_id', user.id)
  await supabase.from('debt_ledger').delete().eq('user_id', user.id)
  await supabase.from('savings_goals').delete().eq('user_id', user.id)

  revalidatePath('/')
  revalidatePath('/ledger')
  revalidatePath('/reports')
  revalidatePath('/savings')
  revalidatePath('/debt')
}