import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Features } from '../components/Features'
import { Pricing } from '../components/Pricing'
import { CTASection } from '../components/CTASection'
import { Footer } from '../components/Footer'

export function Landing() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
