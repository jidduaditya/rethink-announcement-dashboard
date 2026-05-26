export type Category = 'General' | 'Action Required' | 'Event'

export const CATEGORIES: Category[] = ['General', 'Action Required', 'Event']

export interface Announcement {
  id: string
  title: string
  body: string
  category: Category
  is_pinned: boolean
  is_published: boolean
  email_sent: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface Subscriber {
  id: string
  email: string
  is_active: boolean
  unsubscribe_token: string
  created_at: string
}
