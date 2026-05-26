import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllAnnouncements, deleteAnnouncement } from '../lib/queries/announcements'
import AnnouncementTable from '../components/AnnouncementTable'
import EmptyState from '../components/EmptyState'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const queryClient = useQueryClient()
  const [deleting, setDeleting] = useState<string | null>(null)

  const { data: announcements, isLoading, error } = useQuery({
    queryKey: ['announcements', 'all'],
    queryFn: fetchAllAnnouncements,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onMutate: (id) => setDeleting(id),
    onSettled: () => setDeleting(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })

  const published = announcements?.filter((a) => a.is_published).length ?? 0
  const drafts = announcements?.filter((a) => !a.is_published).length ?? 0

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-title font-bold text-ink">Announcements</h1>
          <p className="text-body-sm text-ink-muted mt-1">manage your community broadcasts</p>
        </div>
        <Link
          to="/admin/new"
          className="bg-accent text-white rounded-pill px-5 py-2.5 text-body-sm hover:opacity-90 transition-opacity"
        >
          New announcement
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-bg-elevated border border-border rounded-card px-4 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1">published</p>
          <p className="text-4xl font-bold text-ink">{isLoading ? '--' : published}</p>
        </div>
        <div className="bg-bg-elevated border border-border rounded-card px-4 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1">drafts</p>
          <p className="text-4xl font-bold text-ink">{isLoading ? '--' : drafts}</p>
        </div>
      </div>

      {/* List */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-elevated border border-border rounded-card px-4 py-4 animate-pulse">
              <div className="flex gap-2 mb-3">
                <div className="h-4 w-16 rounded-DEFAULT bg-surface" />
                <div className="h-4 w-20 rounded-DEFAULT bg-surface" />
              </div>
              <div className="h-4 w-3/4 rounded-DEFAULT bg-surface mb-2" />
              <div className="h-3 w-24 rounded-DEFAULT bg-surface" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-bg-elevated border border-border rounded-card px-4 py-4">
          <p className="text-body-sm text-danger">failed to load announcements. please refresh.</p>
        </div>
      )}

      {!isLoading && !error && announcements && announcements.length === 0 && (
        <EmptyState
          title="no announcements yet"
          description="click New announcement to create your first broadcast"
          icon="campaign"
        />
      )}

      {!isLoading && !error && announcements && announcements.length > 0 && (
        <AnnouncementTable
          announcements={announcements}
          onDelete={(id) => deleteMutation.mutate(id)}
          deleting={deleting}
        />
      )}
    </div>
  )
}
