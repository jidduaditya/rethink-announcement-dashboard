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
      <article className="scrapbook-card p-6 md:p-8 relative overflow-visible group">
        <div className="washi-tape" />
        {announcement.is_pinned && (
          <div className="absolute top-6 right-6 flex items-center gap-1 text-marigold">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">pinned</span>
          </div>
        )}
        <div className="pr-20 space-y-3">
          <span className="text-[10px] font-bold text-marigold tracking-widest uppercase">{announcement.category}</span>
          <h2 className="text-xl md:text-2xl font-bold text-charcoal leading-tight">{announcement.title}</h2>
          <div className="prose text-sm">
            <ReactMarkdown>{announcement.body}</ReactMarkdown>
          </div>
          <div className="flex items-center gap-6 pt-3 border-t border-charcoal/5">
            {date && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">calendar_today</span>
                <span className="text-xs text-on-surface-variant">{date}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">category</span>
              <span className="text-xs text-on-surface-variant">{announcement.category}</span>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="scrapbook-card p-4 transition-all hover:border-marigold cursor-pointer flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <span className="px-2 py-0.5 bg-surface-variant rounded-md text-[10px] font-bold text-charcoal shrink-0">
          {announcement.category}
        </span>
        <h2 className="text-base font-bold text-charcoal truncate">{announcement.title}</h2>
      </div>
      {date && <span className="text-[10px] text-on-surface-variant whitespace-nowrap ml-4">{date}</span>}
    </article>
  )
}
