interface SectionHeadingProps {
  badge?: string
  title: string
  subtitle?: string
  centered?: boolean
}

export function SectionHeading({ badge, title, subtitle, centered = true }: SectionHeadingProps) {
  return (
    <div className={`mb-8 sm:mb-12 ${centered ? 'text-center' : ''}`}>
      {badge && (
        <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-3 sm:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto px-4">
          {subtitle}
        </p>
      )}
    </div>
  )
}
