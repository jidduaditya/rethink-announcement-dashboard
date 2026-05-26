import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllAnnouncements, deleteAnnouncement } from '../lib/queries/announcements'
import AnnouncementTable from '../components/AnnouncementTable'
import EmptyState from '../components/EmptyState'
import { useState } from 'react'

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
      <div className="mb-6">
        <h1 className="text-headline-md font-bold text-on-surface">feed management</h1>
        <p className="text-body-sm text-on-surface-variant mt-1">manage your community broadcasts</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="scrapbook-card px-4 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/60 mb-1">published</p>
          <p className="text-display-lg-mobile font-bold text-on-surface">{isLoading ? '--' : published}</p>
        </div>
        <div className="scrapbook-card px-4 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/60 mb-1">drafts</p>
          <p className="text-display-lg-mobile font-bold text-on-surface">{isLoading ? '--' : drafts}</p>
        </div>
      </div>

      {/* List */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="scrapbook-card px-4 py-4 animate-pulse">
              <div className="flex gap-2 mb-3">
                <div className="h-4 w-16 rounded bg-surface-container" />
                <div className="h-4 w-20 rounded bg-surface-container" />
              </div>
              <div className="h-4 w-3/4 rounded bg-surface-container mb-2" />
              <div className="h-3 w-24 rounded bg-surface-container" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="scrapbook-card px-4 py-4 bg-danger-bg border-danger/20">
          <p className="text-body-sm text-danger">failed to load announcements. please refresh.</p>
        </div>
      )}

      {!isLoading && !error && announcements && announcements.length === 0 && (
        <EmptyState
          title="no announcements yet"
          description="tap the + button to create your first broadcast"
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
