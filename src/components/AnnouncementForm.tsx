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

const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70 mb-2'
const inputClass =
  'w-full h-14 px-4 border-2 border-on-surface/10 rounded-card bg-white text-on-surface text-body-sm focus:border-marigold focus:ring-0 transition-all outline-none placeholder:text-on-surface-variant/40'

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
            className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/60 hover:text-on-surface transition-colors flex items-center gap-1"
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
          <div className="min-h-[200px] px-4 py-4 border-2 border-on-surface/10 rounded-card bg-white prose text-body-sm">
            {body ? <ReactMarkdown>{body}</ReactMarkdown> : <p className="text-on-surface-variant/40">nothing to preview</p>}
          </div>
        ) : (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="write your announcement... markdown is supported"
            rows={8}
            className="w-full min-h-[200px] px-4 py-4 border-2 border-on-surface/10 rounded-card bg-white text-on-surface text-body-sm focus:border-marigold focus:ring-0 transition-all outline-none resize-y placeholder:text-on-surface-variant/40"
          />
        )}
        <p className="mt-1.5 text-[11px] text-on-surface-variant/50">markdown supported</p>
      </div>

      {/* Pin toggle */}
      <div className="scrapbook-card relative px-4 py-4">
        <div className="washi-tape" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`material-symbols-outlined text-[20px] ${isPinned ? 'text-marigold' : 'text-on-surface-variant/40'}`}
              style={{ fontVariationSettings: `'FILL' ${isPinned ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20` }}
            >
              push_pin
            </span>
            <div>
              <p className="text-label-md font-semibold text-on-surface">pin to top</p>
              <p className="text-[11px] text-on-surface-variant/60">always shows above other posts</p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={isPinned}
            onClick={() => setIsPinned(!isPinned)}
            className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${
              isPinned ? 'bg-marigold' : 'bg-surface-container border-2 border-on-surface/10'
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
        <div className="px-4 py-3 rounded-card bg-danger-bg border border-danger/20">
          <p className="text-body-sm text-danger">{error}</p>
        </div>
      )}

      {/* Sticky action bar */}
      <div className="fixed bottom-20 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-charcoal-border px-gutter-mobile py-3">
        <div className="max-w-[720px] mx-auto flex gap-3">
          {alreadyPublished ? (
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="flex-1 h-14 rounded-button bg-charcoal text-ivory font-bold text-label-md hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? 'saving...' : 'save changes'}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="flex-1 h-14 rounded-button border-2 border-charcoal text-on-surface font-bold text-label-md hover:bg-surface-container transition-colors disabled:opacity-40"
              >
                {submitting ? 'saving...' : isEdit ? 'save draft' : 'save as draft'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="flex-1 h-14 rounded-button bg-charcoal text-ivory font-bold text-label-md hover:opacity-90 transition-opacity disabled:opacity-60"
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
