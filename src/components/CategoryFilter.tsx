import { CATEGORIES } from '../lib/types'
import type { Category } from '../lib/types'

interface Props {
  selected: Category | 'All'
  onChange: (category: Category | 'All') => void
}

export default function CategoryFilter({ selected, onChange }: Props) {
  const options: (Category | 'All')[] = ['All', ...CATEGORIES]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-[16px] px-[16px] md:mx-0 md:px-0">
      {options.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-6 py-2.5 rounded-[28px] text-sm font-medium whitespace-nowrap transition-all active:scale-95 min-h-[44px] ${
            selected === cat
              ? 'bg-charcoal text-ivory shadow-scrapbook'
              : 'bg-white border border-charcoal/12 text-charcoal hover:bg-marigold/20'
          }`}
        >
          {cat === 'All' ? 'all' : cat.toLowerCase()}
        </button>
      ))}
    </div>
  )
}
