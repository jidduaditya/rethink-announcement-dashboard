import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAnnouncement, createAnnouncement, updateAnnouncement } from '../lib/queries/announcements'
import { useAuth } from '../hooks/useAuth'
import AnnouncementForm from '../components/AnnouncementForm'
import type { AnnouncementFormData } from '../components/AnnouncementForm'

export default function AnnouncementEditor() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data: existing, isLoading: loadingAnnouncement } = useQuery({
    queryKey: ['announcement', id],
    queryFn: () => fetchAnnouncement(id!),
    enabled: isEdit,
  })

  async function handleSubmit(data: AnnouncementFormData, publish: boolean) {
    if (isEdit && id) {
      await updateAnnouncement(id, {
        title: data.title,
        body: data.body,
        category: data.category,
        is_pinned: data.is_pinned,
        is_published: publish,
      })
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcement', id] })
      navigate('/admin')
    } else {
      await createAnnouncement({
        title: data.title,
        body: data.body,
        category: data.category,
        is_pinned: data.is_pinned,
        is_published: publish,
        created_by: user?.id ?? '',
      })
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      navigate('/admin')
    }
  }

  if (isEdit && loadingAnnouncement) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-40 rounded-DEFAULT bg-surface" />
        <div className="h-12 rounded-DEFAULT bg-surface" />
        <div className="h-12 rounded-DEFAULT bg-surface" />
        <div className="h-48 rounded-DEFAULT bg-surface" />
      </div>
    )
  }

  const alreadyPublished = isEdit ? (existing?.is_published ?? false) : false

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin"
          className="w-9 h-9 rounded-full bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors"
          aria-label="back"
        >
          <span
            className="material-symbols-outlined text-ink-muted text-[20px]"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
          >
            arrow_back
          </span>
        </Link>
        <div>
          <h1 className="text-title font-bold text-ink">
            {isEdit ? 'edit announcement' : 'new announcement'}
          </h1>
          {alreadyPublished && (
            <p className="text-caption text-ink-subtle">already published</p>
          )}
        </div>
      </div>

      <AnnouncementForm
        initial={
          existing
            ? {
                title: existing.title,
                body: existing.body,
                category: existing.category,
                is_pinned: existing.is_pinned,
                is_published: existing.is_published,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        isEdit={isEdit}
        alreadyPublished={alreadyPublished}
      />

    </div>
  )
}
