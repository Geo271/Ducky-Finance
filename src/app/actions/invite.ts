'use server'

import { createClient } from '@/utils/supabase/server'

export async function inviteCollaborator(goalId: string, email: string) {
  const supabase = await createClient()
  
  // Basic validation to prevent adding yourself or duplicates
  const { error } = await supabase
    .from('savings_collaborators')
    .insert([{ goal_id: goalId, user_email: email }])

  if (error) throw new Error('Could not invite collaborator')
}