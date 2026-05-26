interface Props {
  title: string
  description: string
  icon?: string
}

export default function EmptyState({ title, description, icon = 'dashboard' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-surface" />
        <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-ink-subtle">
          {icon}
        </span>
      </div>
      <p className="text-caption font-medium text-ink-subtle">{title}</p>
      <p className="text-caption text-ink-subtle mt-1">{description}</p>
    </div>
  )
}
