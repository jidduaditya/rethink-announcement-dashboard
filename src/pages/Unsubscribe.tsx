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
    <div className="min-h-screen bg-background flex items-center justify-center px-gutter-mobile">
      <div className="paper-grain" />

      <div className="text-center max-w-sm">
        <div className="scrapbook-card p-8 relative">
          <div className="washi-tape" />

          {status === 'loading' && (
            <p className="text-body-sm text-on-surface-variant">unsubscribing...</p>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success-bg flex items-center justify-center">
                <span className="material-symbols-outlined text-success text-3xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  check_circle
                </span>
              </div>
              <h1 className="text-headline-md font-bold text-on-surface mb-2">unsubscribed</h1>
              <p className="text-body-sm text-on-surface-variant mb-6">
                you will no longer receive email notifications.
              </p>
              <Link
                to="/"
                className="text-body-sm text-on-surface-variant hover:text-on-surface underline transition-colors"
              >
                back to announcements
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-danger-bg flex items-center justify-center">
                <span className="material-symbols-outlined text-danger text-3xl">
                  error
                </span>
              </div>
              <h1 className="text-headline-md font-bold text-on-surface mb-2">something went wrong</h1>
              <p className="text-body-sm text-on-surface-variant mb-6">
                we could not process your unsubscribe request. please try again.
              </p>
              <Link
                to="/"
                className="text-body-sm text-on-surface-variant hover:text-on-surface underline transition-colors"
              >
                back to announcements
              </Link>
            </>
          )}

          {status === 'missing' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-3xl">
                  link_off
                </span>
              </div>
              <h1 className="text-headline-md font-bold text-on-surface mb-2">invalid link</h1>
              <p className="text-body-sm text-on-surface-variant mb-6">
                this unsubscribe link is not valid.
              </p>
              <Link
                to="/"
                className="text-body-sm text-on-surface-variant hover:text-on-surface underline transition-colors"
              >
                back to announcements
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
