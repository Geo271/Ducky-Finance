// src/app/actions/savings.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function inviteCollaborator(formData: FormData) {
  const supabase = await createClient()
  const goalId = formData.get('goal_id') as string
  const email = formData.get('email') as string

  const { error } = await supabase
    .from('savings_collaborators')
    .insert([{ goal_id: goalId, user_email: email }])

  if (error) throw new Error('Could not invite collaborator: ' + error.message)

  revalidatePath(`/savings/${goalId}`)
}

export async function getSavingsGoals() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return []

  // 1. Fetch goals you created (Owner)
  const { data: ownedGoals } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', user.id)

  // 2. Fetch the IDs of goals you were invited to
  const { data: collabLinks } = await supabase
    .from('savings_collaborators')
    .select('goal_id')
    .eq('user_email', user.email)

  const collabGoalIds = collabLinks?.map(link => link.goal_id) || []
  
  // 3. Fetch the actual goal data for the ones you were invited to
  let collabGoals: any[] = []
  if (collabGoalIds.length > 0) {
    const { data } = await supabase
      .from('savings_goals')
      .select('*')
      .in('id', collabGoalIds)
    collabGoals = data || []
  }

  // 4. Combine both lists safely
  const allGoals = [...(ownedGoals || []), ...collabGoals]
  
  // Remove duplicates (just in case you somehow invited yourself)
  const uniqueGoals = Array.from(new Map(allGoals.map(item => [item.id, item])).values())
  
  // Sort them so the newest goals appear at the top of your dashboard
  uniqueGoals.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return uniqueGoals
}

export async function addSavingsGoal(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const target_amount = Number(formData.get('target_amount'))
  const target_date = formData.get('target_date') as string
  const is_emergency = formData.get('is_emergency') === 'on'

  // 2. Explicitly include user_id in the insert
  const { error } = await supabase
    .from('savings_goals')
    .insert([{ 
      title, 
      target_amount, 
      target_date, 
      is_emergency,
      current_amount: 0,
      user_id: user.id // <--- THIS IS THE FIX
    }])

  if (error) throw new Error('Failed to add goal: ' + error.message)

  revalidatePath('/savings')
}

// NEW: This is the missing function your dynamic page is looking for
export async function getSavingsGoalDetails(id: string) {
  const supabase = await createClient()

  const { data: goal } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('id', id)
    .single()

  // Added .order() so the newest transactions stay at the top of the UI
  const { data: history, error: historyError } = await supabase
    .from('savings_transactions')
    .select('*')
    .eq('savings_goal_id', id)
    .order('created_at', { ascending: false })

  // Log any hidden fetching errors to your VS Code terminal
  if (historyError) {
    console.error("History Fetch Error:", historyError.message)
  }

  const { data: collaborators } = await supabase
    .from('savings_collaborators')
    .select('user_email')
    .eq('goal_id', id)

  return {
    goal,
    history: history || [],
    collaborators: collaborators || []
  }
}

// Add this to the very bottom of src/app/actions/savings.ts

export async function addDirectDeposit(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Authenticate and grab the current user's email
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const goalId = formData.get('savings_goal_id') as string
  const amount = Number(formData.get('amount'))
  const source = formData.get('source') as string

  // 2. Fetch the current goal amount
  const { data: goal } = await supabase
    .from('savings_goals')
    .select('current_amount')
    .eq('id', goalId)
    .single()

  if (!goal) throw new Error('Goal not found')

  // 3. Update the total savings amount
  const newAmount = goal.current_amount + amount
  await supabase
    .from('savings_goals')
    .update({ current_amount: newAmount })
    .eq('id', goalId)

 const { error: txError } = await supabase
    .from('savings_transactions')
    .insert([{
      savings_goal_id: goalId,
      amount: amount,
      source: source,
      description: 'Manual Deposit',
      actor_email: user.email, 
      user_id: user.id // <--- THIS PREVENTS THE CRASH AND ISOLATES THE DEPOSIT
    }])

  if (txError) throw new Error(`Failed to log tx: ${txError.message}`)

  revalidatePath(`/savings/${goalId}`)
}

export async function deleteSavingsGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const id = formData.get('id') as string

  // Hard delete the record
  const { error } = await supabase
    .from('savings_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error('Failed to delete goal')
  revalidatePath('/savings')
}

export async function completeSavingsGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const id = formData.get('id') as string

  // Update status to completed
  const { error } = await supabase
    .from('savings_goals')
    .update({ status: 'completed' })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error('Failed to complete goal')
  revalidatePath('/savings')
}