import { Link } from 'react-router-dom'
import { Button } from './ui/Button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 sm:pt-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-900/20 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent z-10" />
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920')] bg-cover bg-center opacity-20" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-72 h-64 sm:h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6 sm:mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-xs sm:text-sm font-medium">Powered by OpenAI GPT-5.4</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-100 mb-4 sm:mb-6 leading-tight">
          Next-Gen
          <span className="block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            AI Calling System
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
          Experience the future of communication with our intelligent AI-powered calling platform.
          Make calls, chat with AI, and track your expenses all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <Link to="/ai" className="w-full sm:w-auto">
            <Button size="lg" className="w-full min-w-[200px] justify-center text-base">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Start Chatting
            </Button>
          </Link>
          <Link to="/call" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full min-w-[200px] justify-center text-base">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Make a Call
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl sm:max-w-2xl mx-auto">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-1">99.9%</p>
            <p className="text-gray-500 text-xs sm:text-sm">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-1">50+</p>
            <p className="text-gray-500 text-xs sm:text-sm">Daily Calls</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-1">24/7</p>
            <p className="text-gray-500 text-xs sm:text-sm">AI Support</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg width="20" height="20" sm:w-24 sm:h-24 viewBox="0 0 24 24" fill="none" className="text-gray-500">
          <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  )
}
