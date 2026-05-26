import type { Subscriber } from '../lib/types'

interface Props {
  subscribers: Subscriber[]
  onToggleActive: (id: string, isActive: boolean) => void
  onDelete: (id: string) => void
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const months = Math.floor(days / 30)
  if (months > 0) return `${months}mo ago`
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

export default function SubscriberTable({ subscribers, onToggleActive, onDelete }: Props) {
  function handleDelete(id: string, email: string) {
    if (window.confirm(`remove ${email}? this cannot be undone.`)) {
      onDelete(id)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {subscribers.map((s) => (
        <div key={s.id} className="bg-bg-elevated border border-border rounded-card px-5 py-4 flex items-center justify-between gap-3">
          {/* Left: icon + info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-surface text-ink-muted flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
              >
                alternate_email
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-body-sm font-semibold text-ink truncate">{s.email}</p>
                {s.is_active ? (
                  <span className="bg-success-soft text-success text-micro uppercase rounded-pill px-2.5 py-0.5 shrink-0">
                    active
                  </span>
                ) : (
                  <span className="bg-surface text-ink-subtle text-micro uppercase rounded-pill px-2.5 py-0.5 shrink-0">
                    inactive
                  </span>
                )}
              </div>
              <p className="text-caption text-ink-muted mt-0.5">added {timeAgo(s.created_at)}</p>
            </div>
          </div>

          {/* Right: toggle + delete */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleActive(s.id, !s.is_active)}
              className="text-caption text-accent hover:underline"
              title={s.is_active ? 'deactivate' : 'activate'}
            >
              {s.is_active ? 'deactivate' : 'activate'}
            </button>

            <button
              onClick={() => handleDelete(s.id, s.email)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-ink-subtle hover:text-danger transition-colors"
              title="remove subscriber"
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
              >
                close
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
