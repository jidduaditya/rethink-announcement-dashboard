import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchPublishedAnnouncements } from '../lib/queries/announcements'
import AnnouncementCard from '../components/AnnouncementCard'
import CategoryFilter from '../components/CategoryFilter'
import SubscribeBox from '../components/SubscribeBox'
import EmptyState from '../components/EmptyState'
import type { Category } from '../lib/types'

export default function PublicBoard() {
  const [category, setCategory] = useState<Category | 'All'>('All')

  const { data: announcements = [], isLoading, error } = useQuery({
    queryKey: ['announcements', 'published'],
    queryFn: fetchPublishedAnnouncements,
  })

  const filtered = category === 'All'
    ? announcements
    : announcements.filter((a) => a.category === category)

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="min-h-screen bg-bg">
      {/* Top Nav */}
      <header className="fixed top-0 w-full z-50 bg-white/72 backdrop-blur-xl saturate-[180%] border-b border-border h-12">
        <div className="flex justify-between items-center px-4 md:px-6 h-12 max-w-[980px] mx-auto">
          <span className="font-semibold text-base text-ink tracking-tight">
            rethink announcements board
          </span>
          <nav className="hidden md:flex gap-6 items-center">
            <span className="text-xs font-semibold text-accent opacity-100">
              feed
            </span>
            <Link to="/login" className="text-xs text-ink opacity-56 hover:opacity-100 transition-opacity">
              admin
            </Link>
          </nav>
          <div className="md:hidden w-9 h-9" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-32 px-4 md:px-0">
        <div className="max-w-[980px] mx-auto space-y-8">
          {/* Hero */}
          <section className="space-y-2 text-center md:text-left pt-4">
            <h1 className="text-title-lg font-semibold text-ink tracking-tight">Community Board</h1>
            <p className="text-body text-ink-muted max-w-[600px]">
              Stay updated with the latest news, events, and important notices.
            </p>
          </section>

          {/* Subscribe Box */}
          <SubscribeBox />

          {/* Category Filter */}
          <CategoryFilter selected={category} onChange={setCategory} />

          {/* Announcements */}
          <div className="space-y-4">
            {isLoading && (
              <div className="py-20 text-center text-ink-muted text-body-sm">Loading...</div>
            )}

            {error && (
              <div className="py-20 text-center text-danger text-body-sm">
                Failed to load announcements.
              </div>
            )}

            {!isLoading && !error && filtered.length === 0 && (
              <EmptyState
                title="No announcements yet"
                description={category === 'All' ? 'Check back soon.' : `No ${category.toLowerCase()} announcements right now.`}
              />
            )}

            {featured && <AnnouncementCard announcement={featured} featured />}

            {rest.length > 0 && (
              <div className="space-y-2">
                {rest.map((a) => (
                  <AnnouncementCard key={a.id} announcement={a} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-border h-20">
        <div className="flex justify-around items-center h-20 px-4 max-w-[980px] mx-auto">
          <span className="flex flex-col items-center justify-center gap-1">
            <div className="bg-accent text-white rounded-full px-5 py-1.5">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            </div>
            <span className="text-[10px] font-semibold text-ink">feed</span>
          </span>
          <Link to="/login" className="flex flex-col items-center justify-center gap-1 text-ink-subtle">
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-[10px] font-semibold">admin</span>
          </Link>
        </div>
      </nav>

      {/* Footer (desktop) */}
      <footer className="hidden md:block text-center py-6 text-caption text-ink-subtle">
        rethink announcements board
      </footer>
    </div>
  )
}
