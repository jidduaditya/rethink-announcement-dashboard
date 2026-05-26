import { CATEGORIES } from '../lib/types'
import type { Category } from '../lib/types'

interface Props {
  selected: Category | 'All'
  onChange: (category: Category | 'All') => void
}

export default function CategoryFilter({ selected, onChange }: Props) {
  const options: (Category | 'All')[] = ['All', ...CATEGORIES]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      {options.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-pill px-4 py-2 text-caption font-medium whitespace-nowrap transition-all active:scale-95 min-h-[44px] ${
            selected === cat
              ? 'bg-ink text-white border border-ink'
              : 'bg-surface border border-border text-ink-muted hover:bg-surface-hover'
          }`}
        >
          {cat === 'All' ? 'All' : cat}
        </button>
      ))}
    </div>
  )
}
