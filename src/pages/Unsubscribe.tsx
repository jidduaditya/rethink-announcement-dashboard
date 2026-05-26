import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { unsubscribeByToken } from '../lib/queries/subscribers'

type Status = 'loading' | 'success' | 'error' | 'missing'

export default function Unsubscribe() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('missing')
      return
    }

    unsubscribeByToken(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-sm w-full">
        <div className="bg-bg-elevated border border-border rounded-card p-8">
          {status === 'loading' && (
            <p className="text-body-sm text-ink-muted">Unsubscribing...</p>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-success text-3xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  check_circle
                </span>
              </div>
              <h1 className="text-title font-semibold text-ink mb-2">Unsubscribed</h1>
              <p className="text-body-sm text-ink-muted mb-6">
                You will no longer receive email notifications.
              </p>
              <Link
                to="/"
                className="text-body-sm text-accent hover:opacity-80 underline transition-opacity"
              >
                Back to announcements
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-danger text-3xl">
                  error
                </span>
              </div>
              <h1 className="text-title font-semibold text-ink mb-2">Something went wrong</h1>
              <p className="text-body-sm text-ink-muted mb-6">
                We could not process your unsubscribe request. Please try again.
              </p>
              <Link
                to="/"
                className="text-body-sm text-accent hover:opacity-80 underline transition-opacity"
              >
                Back to announcements
              </Link>
            </>
          )}

          {status === 'missing' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-ink-subtle text-3xl">
                  link_off
                </span>
              </div>
              <h1 className="text-title font-semibold text-ink mb-2">Invalid link</h1>
              <p className="text-body-sm text-ink-muted mb-6">
                This unsubscribe link is not valid.
              </p>
              <Link
                to="/"
                className="text-body-sm text-accent hover:opacity-80 underline transition-opacity"
              >
                Back to announcements
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
