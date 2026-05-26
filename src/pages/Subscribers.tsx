import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSubscribers, addSubscriber, updateSubscriber, deleteSubscriber } from '../lib/queries/subscribers'
import SubscriberTable from '../components/SubscriberTable'
import EmptyState from '../components/EmptyState'

export default function Subscribers() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [addError, setAddError] = useState<string | null>(null)

  const { data: subscribers, isLoading, error } = useQuery({
    queryKey: ['subscribers'],
    queryFn: fetchSubscribers,
  })

  const addMutation = useMutation({
    mutationFn: (email: string) => addSubscriber(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
      setNewEmail('')
      setAddError(null)
    },
    onError: (err: Error) => {
      setAddError(err.message ?? 'failed to add subscriber')
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateSubscriber(id, { is_active: isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
    },
  })

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newEmail.trim()
    if (!trimmed) return
    setAddError(null)
    addMutation.mutate(trimmed)
  }

  const filtered = subscribers
    ? subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
    : []

  const activeCount = subscribers ? subscribers.filter((s) => s.is_active).length : 0
  const totalCount = subscribers ? subscribers.length : 0

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-headline-md font-bold text-on-surface">subscriber management</h1>
        <p className="text-body-sm text-on-surface-variant mt-1">
          {isLoading ? 'loading...' : `${activeCount} active of ${totalCount} total`}
        </p>
      </div>

      {/* Add subscriber form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="email address"
          className="flex-1 h-14 px-4 rounded-button bg-surface-container border border-charcoal-border text-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-charcoal/20"
        />
        <button
          type="submit"
          disabled={addMutation.isPending || !newEmail.trim()}
          className="h-14 px-6 rounded-button bg-charcoal text-ivory text-label-md font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
        >
          {addMutation.isPending ? 'adding...' : 'add subscriber'}
        </button>
      </form>

      {addError && (
        <div className="mb-4 px-4 py-3 rounded-[1rem] bg-danger-bg border border-danger/20">
          <p className="text-body-sm text-danger">{addError}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <span
          className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px] pointer-events-none"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
        >
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search subscribers"
          className="w-full h-11 pl-12 pr-4 rounded-[20px] bg-surface-container shadow-sm border border-charcoal-border text-body-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-charcoal/20"
        />
      </div>

      {/* Count label */}
      {!isLoading && !error && subscribers && (
        <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/60 mb-3">
          showing {filtered.length} subscriber{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="scrapbook-card p-5 animate-pulse flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-surface-container shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-48 rounded bg-surface-container mb-2" />
                <div className="h-3 w-24 rounded bg-surface-container" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="scrapbook-card px-4 py-4 bg-danger-bg border-danger/20">
          <p className="text-body-sm text-danger">failed to load subscribers. please refresh.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && subscribers && subscribers.length === 0 && (
        <EmptyState
          title="no subscribers yet"
          description="add an email above to start your list"
          icon="group"
        />
      )}

      {/* Search empty state */}
      {!isLoading && !error && subscribers && subscribers.length > 0 && filtered.length === 0 && (
        <EmptyState
          title="no matches"
          description="try a different search term"
          icon="search_off"
        />
      )}

      {/* Table */}
      {!isLoading && !error && filtered.length > 0 && (
        <SubscriberTable
          subscribers={filtered}
          onToggleActive={(id, isActive) => toggleMutation.mutate({ id, isActive })}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}
    </div>
  )
}
