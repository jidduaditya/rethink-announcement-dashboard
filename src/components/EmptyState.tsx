interface Props {
  title: string
  description: string
  icon?: string
}

export default function EmptyState({ title, description, icon = 'dashboard' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center opacity-40">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-charcoal" />
        <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-charcoal">
          {icon}
        </span>
      </div>
      <p className="text-xs text-charcoal">{title}</p>
      <p className="text-xs text-on-surface-variant mt-1">{description}</p>
    </div>
  )
}
