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
        <div key={a.id} className="bg-bg-elevated border border-border rounded-card p-5">
          {/* Top row: badges + actions */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Status badge */}
              {a.is_published ? (
                <span className="bg-success-soft text-success text-micro uppercase rounded-pill px-2.5 py-0.5 font-semibold tracking-wide">
                  published
                </span>
              ) : (
                <span className="bg-surface text-ink-subtle text-micro uppercase rounded-pill px-2.5 py-0.5 font-semibold tracking-wide">
                  draft
                </span>
              )}

              {/* Category */}
              <span className="text-micro font-semibold uppercase tracking-wide text-ink-subtle px-2.5 py-0.5 rounded-pill bg-surface">
                {a.category}
              </span>

              {/* Email sent indicator */}
              {a.email_sent && (
                <span className="flex items-center gap-0.5 text-micro font-semibold uppercase tracking-wide text-success">
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
            <div className="flex items-center gap-3 shrink-0">
              {a.is_pinned && (
                <span
                  className="material-symbols-outlined text-accent text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  title="pinned"
                >
                  push_pin
                </span>
              )}

              <Link
                to={`/admin/edit/${a.id}`}
                className="text-caption text-accent hover:underline"
                title="edit"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(a.id, a.title)}
                disabled={deleting === a.id}
                className="text-caption text-danger hover:underline disabled:opacity-40"
                title="delete"
              >
                {deleting === a.id ? (
                  <span className="w-3 h-3 border border-danger border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>

          {/* Title */}
          <p className="text-body-sm font-semibold text-ink truncate mb-1">{a.title}</p>

          {/* Date */}
          <p className="text-caption text-ink-subtle">
            {a.is_published ? `published ${formatDate(a.published_at)}` : `created ${formatDate(a.created_at)}`}
          </p>
        </div>
      ))}
    </div>
  )
}
