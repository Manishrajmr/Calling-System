import { useState, useRef, useEffect } from 'react'

interface ChatItem {
  id: string
  title: string
  timestamp: Date
  type: 'call' | 'ai'
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onNewChat: () => void
  onSelectChat: (id: string) => void
  currentChatId?: string
}

// Mock chat data with realistic conversation titles
const MOCK_CHATS: ChatItem[] = [
  { id: '1', title: 'Python coding help', timestamp: new Date(), type: 'ai' },
  { id: '2', title: 'Sales call analysis', timestamp: new Date(), type: 'call' },
  { id: '3', title: 'Email template request', timestamp: new Date(Date.now() - 86400000), type: 'ai' },
  { id: '4', title: 'Customer support transcript', timestamp: new Date(Date.now() - 86400000), type: 'call' },
  { id: '5', title: 'Project planning discussion', timestamp: new Date(Date.now() - 86400000 * 2), type: 'ai' },
  { id: '6', title: 'Marketing campaign review', timestamp: new Date(Date.now() - 86400000 * 2), type: 'call' },
  { id: '7', title: 'API integration guide', timestamp: new Date(Date.now() - 86400000 * 3), type: 'ai' },
  { id: '8', title: 'Bug fixes for login flow', timestamp: new Date(Date.now() - 86400000 * 4), type: 'ai' },
  { id: '9', title: 'Database schema design', timestamp: new Date(Date.now() - 86400000 * 5), type: 'ai' },
  { id: '10', title: 'Product feedback session', timestamp: new Date(Date.now() - 86400000 * 6), type: 'call' },
  { id: '11', title: 'Team standup notes', timestamp: new Date(Date.now() - 86400000 * 7), type: 'ai' },
]

function Sidebar({ isOpen, onToggle, onNewChat, onSelectChat, currentChatId }: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Show only recent chats (today + previous 7 days)
  const getRecentChats = () => {
    return MOCK_CHATS.filter(chat => {
      const diffDays = Math.floor((Date.now() - chat.timestamp.getTime()) / 86400000)
      return diffDays <= 7
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-neutral-900 border-r border-neutral-700 flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-100">AI Assistant</span>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-neutral-700 rounded-lg transition lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Search Chat Button */}
        <div className="px-3 pb-2">
          <button
            onClick={() => document.getElementById('search-modal')?.showModal()}
            className="w-full flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-gray-400 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            Search Chat
          </button>
        </div>

        {/* Navigation Links - Extensible for dashboard */}
        <div className="px-3 py-2 border-b border-neutral-700/50">
          <nav className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:bg-neutral-800 hover:text-gray-200 rounded-lg transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              Dashboard
            </a>
            <a href="/call" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:bg-neutral-800 hover:text-gray-200 rounded-lg transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call
            </a>
            <a href="/ai" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:bg-neutral-800 hover:text-gray-200 rounded-lg transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              AI Chat
            </a>
          </nav>
        </div>

        {/* Recent Chat Tabs */}
        <div className="px-3 pt-3 pb-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Recent Chats</h3>
          <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => document.getElementById('search-modal')?.showModal()}
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition bg-neutral-700 text-gray-100"
            >
              All
            </button>
            <button
              onClick={() => document.getElementById('search-modal')?.showModal()}
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition text-gray-400 hover:text-gray-200"
            >
              Call
            </button>
            <button
              onClick={() => document.getElementById('search-modal')?.showModal()}
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition text-gray-400 hover:text-gray-200"
            >
              AI
            </button>
          </div>
        </div>

        {/* Chat History - Recent Only */}
        <div className="flex-1 overflow-y-auto px-3">
          {getRecentChats().length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">No recent chats</p>
          ) : (
            getRecentChats().map(chat => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition mb-1 ${
                  currentChatId === chat.id
                    ? 'bg-neutral-700 text-gray-100'
                    : 'text-gray-400 hover:bg-neutral-800 hover:text-gray-200'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="truncate">{chat.title}</span>
              </button>
            ))
          )}
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-neutral-700" ref={menuRef}>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-800 rounded-lg transition"
            >
              <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                M
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-100">Manish Raj</p>
                <p className="text-xs text-gray-500">manish@email.com</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl overflow-hidden">
                <div className="p-3 border-b border-neutral-700">
                  <p className="text-sm font-medium text-gray-100">Manish Raj</p>
                  <p className="text-xs text-gray-500">manish@email.com</p>
                </div>
                <div className="p-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-neutral-700 rounded-lg transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-neutral-700 rounded-lg transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Upgrade Plans
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-neutral-700 rounded-lg transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <dialog id="search-modal" className="modal">
        <div className="modal-box bg-neutral-800 p-0 rounded-xl max-w-lg w-full mx-4 overflow-hidden">
          <SearchModal chats={MOCK_CHATS} onSelectChat={onSelectChat} />
        </div>
        <form method="dialog" className="modal-backdrop bg-black/50">
          <button onClick={() => document.getElementById('search-modal')?.close()}>close</button>
        </form>
      </dialog>
    </>
  )
}

// Search Modal Component
interface SearchModalProps {
  chats: ChatItem[]
  onSelectChat: (id: string) => void
}

function SearchModal({ chats, onSelectChat }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today')

  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const chatDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffDays = Math.floor((today.getTime() - chatDate.getTime()) / 86400000)

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getGroupedChats = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayChats: ChatItem[] = []
    const thisWeek: ChatItem[] = []

    chats.forEach(chat => {
      const chatDate = new Date(chat.timestamp.getFullYear(), chat.timestamp.getMonth(), chat.timestamp.getDate())
      const diffDays = Math.floor((today.getTime() - chatDate.getTime()) / 86400000)

      if (diffDays === 0) todayChats.push(chat)
      else if (diffDays <= 7) thisWeek.push(chat)
    })

    return { today: todayChats, thisWeek }
  }

  const groupedChats = getGroupedChats()

  const getDisplayChats = () => {
    if (activeTab === 'today') return groupedChats.today
    return groupedChats.thisWeek
  }

  const getFilteredChats = () => {
    const displayChats = getDisplayChats()
    if (!searchQuery.trim()) return displayChats
    return displayChats.filter(chat =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <>
      {/* Search Input */}
      <div className="p-4 border-b border-neutral-700">
        <div className="flex items-center gap-3 bg-neutral-900 rounded-lg px-3 py-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="flex-1 bg-transparent border-none outline-none text-gray-100 text-sm"
            autoFocus
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-700">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === 'today' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab('week')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === 'week' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Previous 7 Days
        </button>
      </div>

      {/* Results */}
      <div className="max-h-80 overflow-y-auto">
        {getFilteredChats().length > 0 ? (
          <div className="p-2">
            {getFilteredChats().map(chat => (
              <button
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id)
                  document.getElementById('search-modal')?.close()
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-700 rounded-lg transition text-left"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{chat.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(chat.timestamp)} • {chat.type === 'call' ? 'Call' : 'AI'}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8 text-sm">
            {searchQuery ? 'No conversations found' : 'No chats in this category'}
          </p>
        )}
      </div>
    </>
  )
}

export default Sidebar