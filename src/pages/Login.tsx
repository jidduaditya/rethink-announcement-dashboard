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
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-bg-elevated border border-border rounded-card p-8">
          <h1 className="text-title font-semibold text-ink mb-1">Admin Login</h1>
          <p className="text-body-sm text-ink-muted mb-8">
            Sign in to manage your announcements
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-caption text-ink-muted" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 w-full bg-bg border border-border rounded-input text-body text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-caption text-ink-muted" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 w-full bg-bg border border-border rounded-input text-body text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-body-sm text-danger px-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="h-12 w-full mt-2 bg-accent text-white font-semibold text-body-sm rounded-pill active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
