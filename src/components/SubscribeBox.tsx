import { useState } from 'react'
import { subscribe } from '../lib/queries/subscribers'

export default function SubscribeBox() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      await subscribe(email.trim())
      setStatus('success')
      setMessage('Subscribed! You will receive email updates.')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <div className="bg-bg-elevated border border-border rounded-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-title-sm font-semibold text-ink">Get email updates</h3>
          <p className="text-body-sm text-ink-muted">Never miss an important announcement.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow md:w-64 px-4 py-3 rounded-input border border-border bg-bg text-body-sm text-ink outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/30 placeholder:text-ink-subtle"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-accent text-white font-semibold text-body-sm px-6 py-3 rounded-pill hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 min-h-[44px]"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
      {message && (
        <p className={`text-body-sm mt-3 ${status === 'success' ? 'text-success' : 'text-danger'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
