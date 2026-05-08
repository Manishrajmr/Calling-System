interface TextareaProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
  rows?: number
  disabled?: boolean
  className?: string
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  disabled = false,
  className = ""
}: TextareaProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm sm:text-base font-medium text-gray-200">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={`w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-base sm:text-sm text-gray-100 placeholder-gray-400 transition-all duration-200 outline-none resize-none ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-neutral-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {error && (
        <p className="text-red-400 text-sm flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
