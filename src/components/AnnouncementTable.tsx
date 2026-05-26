import { Link } from 'react-router-dom'
import type { Announcement } from '../lib/types'

interface Props {
  announcements: Announcement[]
  onDelete: (id: string) => void
  deleting: string | null
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AnnouncementTable({ announcements, onDelete, deleting }: Props) {
  function handleDelete(id: string, title: string) {
    if (window.confirm(`delete "${title}"? this cannot be undone.`)) {
      onDelete(id)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {announcements.map((a) => (
        <div key={a.id} className="scrapbook-card px-4 py-4">
          {/* Top row: badges + actions */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Status badge */}
              {a.is_published ? (
                <span className="bg-success-bg text-success text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                  published
                </span>
              ) : (
                <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                  draft
                </span>
              )}

              {/* Category */}
              <span className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant/60 px-2 py-0.5 rounded-sm bg-surface-container">
                {a.category}
              </span>

              {/* Email sent indicator */}
              {a.email_sent && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-success/80">
                  <span
                    className="material-symbols-outlined text-[12px]"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  >
                    mark_email_read
                  </span>
                  emailed
                </span>
              )}
            </div>

            {/* Pinned icon + actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {a.is_pinned && (
                <span
                  className="material-symbols-outlined text-marigold text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  title="pinned"
                >
                  push_pin
                </span>
              )}

              <Link
                to={`/admin/edit/${a.id}`}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-variant transition-colors"
                title="edit"
              >
                <span
                  className="material-symbols-outlined text-on-surface-variant text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                >
                  edit
                </span>
              </Link>

              <button
                onClick={() => handleDelete(a.id, a.title)}
                disabled={deleting === a.id}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container hover:bg-danger-bg transition-colors disabled:opacity-40"
                title="delete"
              >
                {deleting === a.id ? (
                  <span className="w-3 h-3 border border-danger border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span
                    className="material-symbols-outlined text-on-surface-variant hover:text-danger text-[16px] transition-colors"
                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  >
                    delete
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Title */}
          <p className="text-label-md font-semibold text-on-surface truncate mb-1">{a.title}</p>

          {/* Date */}
          <p className="text-[11px] text-on-surface-variant/60">
            {a.is_published ? `published ${formatDate(a.published_at)}` : `created ${formatDate(a.created_at)}`}
          </p>
        </div>
      ))}
    </div>
  )
}
