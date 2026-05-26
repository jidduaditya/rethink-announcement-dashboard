import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAnnouncement, createAnnouncement, updateAnnouncement, sendAnnouncementEmails } from '../lib/queries/announcements'
import { fetchActiveSubscriberCount } from '../lib/queries/subscribers'
import { useAuth } from '../hooks/useAuth'
import AnnouncementForm from '../components/AnnouncementForm'
import PublishConfirmDialog from '../components/PublishConfirmDialog'
import type { AnnouncementFormData } from '../components/AnnouncementForm'

export default function AnnouncementEditor() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Pending publish state: saved announcement id + form data waiting for confirm
  const [pendingPublishId, setPendingPublishId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const { data: existing, isLoading: loadingAnnouncement } = useQuery({
    queryKey: ['announcement', id],
    queryFn: () => fetchAnnouncement(id!),
    enabled: isEdit,
  })

  const { data: subscriberCount = 0 } = useQuery({
    queryKey: ['subscribers', 'count'],
    queryFn: fetchActiveSubscriberCount,
  })

  async function handleSubmit(data: AnnouncementFormData, publish: boolean) {
    if (isEdit && id) {
      const wasAlreadyPublished = existing?.is_published ?? false
      const updated = await updateAnnouncement(id, {
        title: data.title,
        body: data.body,
        category: data.category,
        is_pinned: data.is_pinned,
        is_published: publish,
      })
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcement', id] })

      // First time publishing with subscribers => show confirm for email
      if (publish && !wasAlreadyPublished && subscriberCount > 0) {
        setPendingPublishId(updated.id)
        setShowConfirm(true)
        return
      }
      navigate('/admin')
    } else {
      const created = await createAnnouncement({
        title: data.title,
        body: data.body,
        category: data.category,
        is_pinned: data.is_pinned,
        is_published: publish,
        created_by: user?.id ?? '',
      })
      queryClient.invalidateQueries({ queryKey: ['announcements'] })

      // First time publishing with subscribers => show confirm for email
      if (publish && subscriberCount > 0) {
        setPendingPublishId(created.id)
        setShowConfirm(true)
        return
      }
      navigate('/admin')
    }
  }

  async function handleConfirmSend() {
    if (!pendingPublishId) return
    await sendAnnouncementEmails(pendingPublishId)
    await updateAnnouncement(pendingPublishId, { email_sent: true })
    queryClient.invalidateQueries({ queryKey: ['announcements'] })
    setShowConfirm(false)
    navigate('/admin')
  }

  function handleCancelConfirm() {
    setShowConfirm(false)
    navigate('/admin')
  }

  if (isEdit && loadingAnnouncement) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-40 rounded-card bg-surface-container" />
        <div className="h-14 rounded-card bg-surface-container" />
        <div className="h-14 rounded-card bg-surface-container" />
        <div className="h-48 rounded-card bg-surface-container" />
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
          className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-variant transition-colors"
          aria-label="back"
        >
          <span
            className="material-symbols-outlined text-on-surface-variant text-[20px]"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
          >
            arrow_back
          </span>
        </Link>
        <div>
          <h1 className="text-headline-sm font-bold text-on-surface">
            {isEdit ? 'edit announcement' : 'new announcement'}
          </h1>
          {alreadyPublished && (
            <p className="text-[11px] text-on-surface-variant/60">already published</p>
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

      {showConfirm && (
        <PublishConfirmDialog
          subscriberCount={subscriberCount}
          onConfirm={handleConfirmSend}
          onCancel={handleCancelConfirm}
        />
      )}
    </div>
  )
}
