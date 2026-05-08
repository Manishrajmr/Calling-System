import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-base sm:text-xl font-bold text-gray-100">AI Calling</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-md">
              Transform your communication with AI-powered calling and chat.
            </p>
          </div>

          <div>
            <h4 className="text-gray-100 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-500 hover:text-emerald-400 transition text-sm">Dashboard</Link></li>
              <li><Link to="/ai" className="text-gray-500 hover:text-emerald-400 transition text-sm">AI Chat</Link></li>
              <li><Link to="/call" className="text-gray-500 hover:text-emerald-400 transition text-sm">Make Call</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-100 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-emerald-400 transition text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-500 hover:text-emerald-400 transition text-sm">API Reference</a></li>
              <li><a href="#" className="text-gray-500 hover:text-emerald-400 transition text-sm">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-100 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-neutral-700 transition">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-neutral-700 transition">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2026 AI Calling System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
