import { NavLink, Outlet, useNavigate } from 'react-router-dom'
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

  return (
    <div className="min-h-screen bg-bg">
      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-white/72 backdrop-blur-xl saturate-[180%] border-b border-border z-50 flex items-center justify-between px-6">
        {/* Left: wordmark + nav links */}
        <div className="flex items-center">
          <span className="text-xs font-semibold text-ink mr-6">
            rethink announcements board
          </span>

          <nav className="flex items-center">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `text-xs px-3 h-12 flex items-center transition-all ${
                  isActive ? 'opacity-100 font-semibold text-accent' : 'text-ink opacity-56 hover:opacity-100'
                }`
              }
            >
              Announcements
            </NavLink>

            <NavLink
              to="/admin/subscribers"
              className={({ isActive }) =>
                `text-xs px-3 h-12 flex items-center transition-all ${
                  isActive ? 'opacity-100 font-semibold text-accent' : 'text-ink opacity-56 hover:opacity-100'
                }`
              }
            >
              Subscribers
            </NavLink>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ink opacity-56 hover:opacity-100 px-3 h-12 flex items-center transition-all"
            >
              View Board
            </a>

            <button
              onClick={handleLogout}
              className="text-xs text-ink opacity-56 hover:opacity-100 px-3 h-12 flex items-center transition-all"
            >
              Sign out
            </button>
          </nav>
        </div>

        {/* Right: user initials */}
        <div className="w-8 h-8 rounded-full bg-surface text-ink-muted text-label flex items-center justify-center font-medium select-none">
          {initials}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[980px] mx-auto px-12 pt-16 pb-12">
        <Outlet />
      </main>
    </div>
  )
}
