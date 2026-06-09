'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Cast to `any` to bypass missing generated type for notifications table
  const { data } = await (supabase as any)
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (data as any[]) || []
}

export async function markAsRead(notificationId: string) {
  const supabase = await createClient()
  await (supabase as any)
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
  revalidatePath('/')
}