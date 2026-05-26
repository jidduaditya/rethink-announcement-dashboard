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
    <div className="min-h-screen bg-background">
      <div className="paper-grain" />

      {/* Top Nav */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-charcoal/12 h-16">
        <div className="flex justify-between items-center px-[16px] md:px-[24px] h-16 max-w-[800px] mx-auto">
          <span className="font-bold text-xl md:text-2xl italic tracking-tighter text-charcoal">
            rethink announcements board
          </span>
          <nav className="hidden md:flex gap-8 items-center">
            <span className="font-semibold text-charcoal text-sm relative">
              feed
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-marigold rounded-full" />
            </span>
            <Link to="/login" className="text-on-surface-variant hover:text-charcoal transition-colors text-sm">
              admin
            </Link>
          </nav>
          <div className="md:hidden w-9 h-9" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-[16px] md:px-0">
        <div className="max-w-[800px] mx-auto space-y-8">
          {/* Hero */}
          <section className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">community board</h1>
            <p className="text-base md:text-lg text-on-surface-variant max-w-[600px]">
              stay updated with the latest news, events, and important notices.
            </p>
          </section>

          {/* Subscribe Box */}
          <SubscribeBox />

          {/* Category Filter */}
          <CategoryFilter selected={category} onChange={setCategory} />

          {/* Announcements */}
          <div className="space-y-4">
            {isLoading && (
              <div className="py-20 text-center text-on-surface-variant text-sm">loading...</div>
            )}

            {error && (
              <div className="py-20 text-center text-danger text-sm">
                failed to load announcements.
              </div>
            )}

            {!isLoading && !error && filtered.length === 0 && (
              <EmptyState
                title="no announcements yet"
                description={category === 'All' ? 'check back soon.' : `no ${category.toLowerCase()} announcements right now.`}
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
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-background/90 backdrop-blur-md border-t border-charcoal/5 h-20">
        <div className="flex justify-around items-center h-20 px-4 max-w-[720px] mx-auto">
          <span className="flex flex-col items-center justify-center gap-1">
            <div className="bg-marigold text-charcoal rounded-full px-5 py-1.5">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            </div>
            <span className="text-[10px] font-bold text-charcoal">feed</span>
          </span>
          <Link to="/login" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant/40">
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-[10px] font-bold">admin</span>
          </Link>
        </div>
      </nav>

      {/* Footer (desktop) */}
      <footer className="hidden md:block text-center py-6 text-xs text-on-surface-variant">
        rethink announcements board
      </footer>
    </div>
  )
}
