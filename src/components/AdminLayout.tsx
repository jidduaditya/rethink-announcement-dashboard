import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function getInitials(email: string | undefined): string {
  if (!email) return 'ad'
  const local = email.split('@')[0]
  if (local.length >= 2) return local.slice(0, 2)
  return local.padEnd(2, 'x')
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initials = getInitials(user?.email)

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex flex-col items-center gap-0.5 pt-3 pb-2 px-5 transition-colors ${
      isActive ? 'text-on-surface' : 'text-on-surface-variant/60'
    }`

  return (
    <div className="min-h-screen bg-background">
      <div className="paper-grain" />

      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b border-charcoal-border z-50 flex items-center justify-between px-gutter-mobile">
        <Link to="/admin" className="font-bold italic tracking-tight text-on-surface text-body-lg">
          rethink announcements board
        </Link>

        <button
          onClick={handleLogout}
          title="sign out"
          className="w-9 h-9 rounded-full bg-charcoal text-ivory flex items-center justify-center text-label-sm font-semibold uppercase hover:opacity-80 transition-opacity"
        >
          {initials}
        </button>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-32 px-gutter-mobile max-w-[720px] mx-auto">
        <Outlet />
      </main>

      {/* FAB */}
      <Link
        to="/admin/new"
        className="fixed bottom-24 right-6 w-14 h-14 bg-charcoal text-ivory rounded-lg shadow-scrapbook-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all z-50"
        aria-label="new announcement"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
          add
        </span>
      </Link>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/95 backdrop-blur-md border-t border-charcoal-border z-50 flex items-stretch justify-around">
        <NavLink to="/admin" end className={navLinkClass}>
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-marigold rounded-full" />
              )}
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
              >
                dashboard
              </span>
              <span className="text-label-sm">feed</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/subscribers" className={navLinkClass}>
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-marigold rounded-full" />
              )}
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
              >
                group
              </span>
              <span className="text-label-sm">subscribers</span>
            </>
          )}
        </NavLink>

        <button
          className="relative flex flex-col items-center gap-0.5 pt-3 pb-2 px-5 text-on-surface-variant/60 transition-colors"
          onClick={handleLogout}
          title="sign out"
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
          >
            logout
          </span>
          <span className="text-label-sm">sign out</span>
        </button>
      </nav>
    </div>
  )
}
