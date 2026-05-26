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
      {subscribers.map((s, i) => (
        <div key={s.id} className="scrapbook-card p-5 flex items-center justify-between gap-3">
          {/* Washi tape on every 3rd card (0-indexed: 2, 5, 8…) */}
          {(i + 1) % 3 === 0 && <div className="washi-tape" />}

          {/* Left: icon + info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-on-surface-variant text-[20px]"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
              >
                alternate_email
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-label-md font-semibold text-on-surface truncate">{s.email}</p>
                {s.is_active ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide bg-success-bg text-success shrink-0">
                    active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide bg-surface-container text-on-surface-variant shrink-0">
                    inactive
                  </span>
                )}
              </div>
              <p className="text-[11px] text-on-surface-variant/50 mt-0.5">added {timeAgo(s.created_at)}</p>
            </div>
          </div>

          {/* Right: toggle + delete */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleActive(s.id, !s.is_active)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-variant transition-colors"
              title={s.is_active ? 'deactivate' : 'activate'}
            >
              <span
                className="material-symbols-outlined text-on-surface-variant text-[16px]"
                style={{ fontVariationSettings: `'FILL' ${s.is_active ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20` }}
              >
                {s.is_active ? 'toggle_on' : 'toggle_off'}
              </span>
            </button>

            <button
              onClick={() => handleDelete(s.id, s.email)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container hover:bg-danger-bg transition-colors group"
              title="remove subscriber"
            >
              <span
                className="material-symbols-outlined text-charcoal/30 group-hover:text-danger text-[16px] transition-colors"
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
