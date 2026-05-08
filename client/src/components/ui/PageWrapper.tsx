interface PageWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function PageWrapper({ children, title, subtitle }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-gray-100 mb-2">{title}</h1>
            )}
            {subtitle && (
              <p className="text-gray-500">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
