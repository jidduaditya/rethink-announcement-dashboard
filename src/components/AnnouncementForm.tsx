import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { CATEGORIES } from '../lib/types'
import type { Category } from '../lib/types'

export interface AnnouncementFormData {
  title: string
  body: string
  category: Category
  is_pinned: boolean
  is_published: boolean
}

interface Props {
  initial?: Partial<AnnouncementFormData>
  onSubmit: (data: AnnouncementFormData, publish: boolean) => Promise<void>
  isEdit?: boolean
  alreadyPublished?: boolean
}

const labelClass = 'block text-micro uppercase tracking-wide text-ink-muted mb-2'
const inputClass =
  'w-full h-12 px-4 bg-bg border border-border rounded-input text-body text-ink focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none placeholder:text-ink-subtle transition-all'

export default function AnnouncementForm({ initial, onSubmit, isEdit = false, alreadyPublished = false }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [category, setCategory] = useState<Category>(initial?.category ?? 'General')
  const [isPinned, setIsPinned] = useState(initial?.is_pinned ?? false)
  const [preview, setPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(publish: boolean) {
    if (!title.trim()) {
      setError('title is required')
      return
    }
    if (!body.trim()) {
      setError('body is required')
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({ title, body, category, is_pinned: isPinned, is_published: publish }, publish)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-28">
      {/* Title */}
      <div>
        <label className={labelClass}>title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="announcement title"
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className={inputClass + ' appearance-none cursor-pointer'}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Body */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass + ' mb-0'}>body</label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-caption text-accent hover:underline flex items-center gap-1"
          >
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: `'FILL' ${preview ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20` }}
            >
              {preview ? 'edit_note' : 'preview'}
            </span>
            {preview ? 'edit' : 'preview'}
          </button>
        </div>

        {preview ? (
          <div className="min-h-[200px] px-4 py-4 border border-border rounded-input bg-bg prose text-body">
            {body ? <ReactMarkdown>{body}</ReactMarkdown> : <p className="text-ink-subtle">nothing to preview</p>}
          </div>
        ) : (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="write your announcement... markdown is supported"
            rows={8}
            className="w-full min-h-[200px] px-4 py-4 border border-border rounded-input bg-bg text-ink text-body focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none resize-y placeholder:text-ink-subtle transition-all"
          />
        )}
        <p className="mt-1.5 text-caption text-ink-subtle">markdown supported</p>
      </div>

      {/* Pin toggle */}
      <div className="bg-bg-elevated border border-border rounded-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`material-symbols-outlined text-[20px] ${isPinned ? 'text-accent' : 'text-ink-subtle'}`}
              style={{ fontVariationSettings: `'FILL' ${isPinned ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20` }}
            >
              push_pin
            </span>
            <div>
              <p className="text-body-sm font-semibold text-ink">pin to top</p>
              <p className="text-caption text-ink-subtle">always shows above other posts</p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={isPinned}
            onClick={() => setIsPinned(!isPinned)}
            className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${
              isPinned ? 'bg-accent' : 'bg-surface border border-border'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                isPinned ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-card bg-danger-soft border border-danger/20">
          <p className="text-body-sm text-danger">{error}</p>
        </div>
      )}

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/72 backdrop-blur-xl border-t border-border px-6 py-3">
        <div className="max-w-[980px] mx-auto flex gap-3">
          {alreadyPublished ? (
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="flex-1 h-12 rounded-pill bg-accent text-white text-body-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? 'saving...' : 'save changes'}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="flex-1 h-12 rounded-pill border border-border text-ink text-body-sm font-semibold hover:bg-surface transition-colors disabled:opacity-40"
              >
                {submitting ? 'saving...' : isEdit ? 'save draft' : 'save as draft'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="flex-1 h-12 rounded-pill bg-accent text-white text-body-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? 'publishing...' : 'publish'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
