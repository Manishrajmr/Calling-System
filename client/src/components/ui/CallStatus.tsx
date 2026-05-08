interface CallStatusProps {
  status: "idle" | "loading" | "success" | "error"
  message: string
}

export function CallStatus({ status, message }: CallStatusProps) {
  const statusConfig = {
    idle: {
      bg: "bg-neutral-800/50",
      border: "border-neutral-700",
      text: "text-gray-400",
      icon: null
    },
    loading: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      icon: (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )
    },
    success: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    error: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    }
  }

  const config = statusConfig[status]

  if (status === "idle") return null

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg px-4 py-3 flex items-center gap-3 ${config.text}`}>
      {config.icon}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}
