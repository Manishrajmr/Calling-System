import { SectionHeading } from './ui/SectionHeading'
import { Button } from './ui/Button'
import { Link } from 'react-router-dom'

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for trying out the platform',
      features: [
        '100 AI chat messages/month',
        '10 outbound calls/month',
        'Basic cost tracking',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'For professionals and small teams',
      features: [
        'Unlimited AI chat messages',
        '100 outbound calls/month',
        'Advanced cost analytics',
        'Real-time exchange rates',
        'Priority support'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large scale deployments',
      features: [
        'Unlimited everything',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise option'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pricing"
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that fits your needs"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-neutral-900 border rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] ${
                plan.popular
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-3 sm:px-4 py-1 bg-emerald-500 text-white text-xs sm:text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-xs sm:text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-100">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-gray-500 text-sm">/month</span>}
                </div>
              </div>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3 text-gray-400 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-400 flex-shrink-0">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={plan.name === 'Starter' ? '/' : '/ai'}>
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full text-sm sm:text-base"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
