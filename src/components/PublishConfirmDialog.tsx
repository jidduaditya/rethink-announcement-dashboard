import { useState } from 'react'

interface Props {
  subscriberCount: number
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export default function PublishConfirmDialog({ subscriberCount, onConfirm, onCancel }: Props) {
  const [sending, setSending] = useState(false)

  async function handleConfirm() {
    setSending(true)
    try {
      await onConfirm()
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-xl saturate-[180%]"
        onClick={!sending ? onCancel : undefined}
      />

      {/* Dialog card */}
      <div className="bg-bg-elevated border border-border rounded-card relative z-10 w-full max-w-sm p-8 flex flex-col items-center text-center shadow-modal">
        {/* Campaign icon */}
        <div className="w-14 h-14 rounded-full bg-accent-soft flex items-center justify-center mb-5">
          <span
            className="material-symbols-outlined text-accent text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
          >
            campaign
          </span>
        </div>

        <h2 className="text-title-sm font-bold text-ink mb-2">confirm publication</h2>
        <p className="text-body-sm text-ink-muted mb-1">
          this will publish your announcement
        </p>
        <p className="text-body-sm text-ink font-semibold mb-6">
          and email{' '}
          <span className="text-ink font-bold">{subscriberCount}</span>{' '}
          {subscriberCount === 1 ? 'subscriber' : 'subscribers'}
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            disabled={sending}
            className="flex-1 h-12 rounded-pill border border-border text-ink text-body-sm font-semibold hover:bg-surface transition-colors disabled:opacity-40"
          >
            cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={sending}
            className="flex-1 h-12 rounded-pill bg-accent text-white text-body-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {sending ? 'sending...' : 'confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
