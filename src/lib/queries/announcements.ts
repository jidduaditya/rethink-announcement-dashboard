import { supabase } from '../supabase'
import type { Announcement } from '../types'

export async function fetchPublishedAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_published', true)
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })

  if (error) throw error
  return data as Announcement[]
}

export async function fetchAllAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Announcement[]
}

export async function fetchAnnouncement(id: string): Promise<Announcement> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Announcement
}

export async function createAnnouncement(
  announcement: Pick<Announcement, 'title' | 'body' | 'category' | 'is_pinned' | 'is_published'> & { created_by: string }
): Promise<Announcement> {
  const payload = {
    ...announcement,
    published_at: announcement.is_published ? new Date().toISOString() : null,
  }
  const { data, error } = await supabase.from('announcements').insert(payload).select().single()
  if (error) throw error
  return data as Announcement
}

export async function updateAnnouncement(
  id: string,
  updates: Partial<Pick<Announcement, 'title' | 'body' | 'category' | 'is_pinned' | 'is_published' | 'email_sent'>>
): Promise<Announcement> {
  const payload: Record<string, unknown> = { ...updates }
  if (updates.is_published) {
    const existing = await fetchAnnouncement(id)
    if (!existing.published_at) {
      payload.published_at = new Date().toISOString()
    }
  }
  const { data, error } = await supabase.from('announcements').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as Announcement
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw error
}

export async function sendAnnouncementEmails(announcementId: string): Promise<{ sent: number }> {
  const { data, error } = await supabase.functions.invoke('send-announcement-email', {
    body: { announcement_id: announcementId },
  })
  if (error) throw error
  return data as { sent: number }
}
