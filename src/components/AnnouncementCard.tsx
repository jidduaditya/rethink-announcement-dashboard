import ReactMarkdown from 'react-markdown'
import type { Announcement } from '../lib/types'

interface Props {
  announcement: Announcement
  featured?: boolean
}

export default function AnnouncementCard({ announcement, featured }: Props) {
  const date = announcement.published_at
    ? new Date(announcement.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: featured ? 'numeric' : undefined })
    : null

  if (featured) {
    return (
      <article className="bg-bg-elevated border border-border rounded-card p-6 md:p-8 relative overflow-hidden group">
        {announcement.is_pinned && (
          <div className="absolute top-6 right-6 flex items-center gap-1 text-accent">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
            <span className="text-micro font-semibold uppercase tracking-wider">pinned</span>
          </div>
        )}
        <div className="pr-20 space-y-3">
          <span className="text-micro font-semibold text-accent tracking-widest uppercase">{announcement.category}</span>
          <h2 className="text-title-sm font-semibold text-ink leading-tight">{announcement.title}</h2>
          <div className="prose text-body-sm text-ink-muted">
            <ReactMarkdown>{announcement.body}</ReactMarkdown>
          </div>
          <div className="flex items-center gap-6 pt-3 border-t border-border">
            {date && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-ink-subtle text-lg">calendar_today</span>
                <span className="text-caption text-ink-muted">{date}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-ink-subtle text-lg">category</span>
              <span className="text-caption text-ink-muted">{announcement.category}</span>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="bg-bg-elevated border border-border rounded-card p-4 transition-all hover:border-border-light cursor-pointer flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <span className="px-2 py-0.5 bg-surface rounded-DEFAULT text-micro font-semibold text-accent shrink-0">
          {announcement.category}
        </span>
        <h2 className="text-body font-semibold text-ink truncate">{announcement.title}</h2>
      </div>
      {date && <span className="text-caption text-ink-muted whitespace-nowrap ml-4">{date}</span>}
    </article>
  )
}
