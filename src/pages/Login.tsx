import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'invalid credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-gutter-mobile">
      <div className="paper-grain" />

      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="scrapbook-card p-8 relative">
          <div className="washi-tape" />

          <h1 className="text-headline-md text-on-surface font-bold mb-1">admin login</h1>
          <p className="text-body-sm text-on-surface-variant mb-8">
            sign in to manage your announcements
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-label-sm text-on-surface-variant" htmlFor="email">
                email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-4 w-full bg-transparent border-2 border-on-surface/10 rounded-card text-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-marigold transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-sm text-on-surface-variant" htmlFor="password">
                password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 px-4 w-full bg-transparent border-2 border-on-surface/10 rounded-card text-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-marigold transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-body-sm text-danger px-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="h-14 w-full mt-2 bg-charcoal text-ivory font-semibold text-label-md rounded-button active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'signing in...' : 'sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
