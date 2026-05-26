import { supabase } from '../supabase'
import type { Subscriber } from '../types'

export async function subscribe(email: string): Promise<void> {
  const { error } = await supabase.from('subscribers').insert({ email })
  if (error) {
    if (error.code === '23505') throw new Error('This email is already subscribed.')
    throw error
  }
}

export async function fetchSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Subscriber[]
}

export async function fetchActiveSubscriberCount(): Promise<number> {
  const { count, error } = await supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true)
  if (error) throw error
  return count ?? 0
}

export async function addSubscriber(email: string): Promise<Subscriber> {
  const { data, error } = await supabase.from('subscribers').insert({ email }).select().single()
  if (error) throw error
  return data as Subscriber
}

export async function updateSubscriber(id: string, updates: Partial<Pick<Subscriber, 'is_active'>>): Promise<void> {
  const { error } = await supabase.from('subscribers').update(updates).eq('id', id)
  if (error) throw error
}

export async function deleteSubscriber(id: string): Promise<void> {
  const { error } = await supabase.from('subscribers').delete().eq('id', id)
  if (error) throw error
}

export async function unsubscribeByToken(token: string): Promise<void> {
  const { error } = await supabase.rpc('unsubscribe', { token })
  if (error) throw error
}
