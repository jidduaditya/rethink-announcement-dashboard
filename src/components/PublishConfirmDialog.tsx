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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-gutter-mobile">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/20 backdrop-blur-sm"
        onClick={!sending ? onCancel : undefined}
      />

      {/* Dialog card */}
      <div className="scrapbook-card relative z-10 w-full max-w-sm px-6 py-8 flex flex-col items-center text-center shadow-scrapbook-lg">
        {/* Washi tape */}
        <div className="washi-tape" />

        {/* Campaign icon */}
        <div className="w-14 h-14 rounded-full bg-marigold flex items-center justify-center mb-5 shadow-scrapbook">
          <span
            className="material-symbols-outlined text-charcoal text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
          >
            campaign
          </span>
        </div>

        <h2 className="text-headline-sm font-bold text-on-surface mb-2">confirm publication</h2>
        <p className="text-body-sm text-on-surface-variant mb-1">
          this will publish your announcement
        </p>
        <p className="text-body-sm text-on-surface font-semibold mb-6">
          and email{' '}
          <span className="text-on-surface font-bold">{subscriberCount}</span>{' '}
          {subscriberCount === 1 ? 'subscriber' : 'subscribers'}
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            disabled={sending}
            className="flex-1 h-14 rounded-button border-2 border-charcoal-border text-on-surface font-bold text-label-md hover:bg-surface-container transition-colors disabled:opacity-40"
          >
            cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={sending}
            className="flex-1 h-14 rounded-button bg-charcoal text-ivory font-bold text-label-md hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {sending ? 'sending...' : 'confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
