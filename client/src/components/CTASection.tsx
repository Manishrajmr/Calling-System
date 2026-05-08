import { SectionHeading } from './ui/SectionHeading'
import { Button } from './ui/Button'
import { Link } from 'react-router-dom'

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-neutral-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <SectionHeading
          badge="Get Started"
          title="Ready to Transform Your Communication?"
          subtitle="Join thousands of users already using our AI-powered calling and chat platform."
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Link to="/ai">
            <Button size="lg" className="min-w-[180px] sm:min-w-[200px]">
              Start Free Today
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="min-w-[180px] sm:min-w-[200px]">
              View Dashboard
            </Button>
          </Link>
        </div>

        <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6">
          No credit card required • Free tier available • Cancel anytime
        </p>
      </div>
    </section>
  )
}
