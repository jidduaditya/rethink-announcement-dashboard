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
      setMessage('subscribed! you will receive email updates.')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'something went wrong.')
    }
  }

  return (
    <div className="bg-surface-variant/40 p-6 md:p-8 rounded-lg border border-surface-variant relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-charcoal">get email updates</h3>
          <p className="text-sm text-on-surface-variant">never miss an important announcement.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow md:w-64 px-4 py-3 rounded-[28px] border border-surface-variant bg-white text-sm outline-none transition-all focus:border-charcoal focus:ring-1 focus:ring-charcoal placeholder:text-charcoal/30"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-charcoal text-ivory font-bold text-sm px-8 py-3 rounded-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 min-h-[44px]"
          >
            {status === 'loading' ? 'subscribing...' : 'subscribe'}
          </button>
        </form>
      </div>
      {message && (
        <p className={`text-sm mt-3 ${status === 'success' ? 'text-success' : 'text-danger'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
