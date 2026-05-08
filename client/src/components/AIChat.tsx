import { useState, useRef, useEffect } from 'react'
import { sendAIChatMessage } from '../services/api'
import { getUSDToINRRate } from '../services/exchangeRate'
import Sidebar from './Sidebar'

interface UsageData {
  input_tokens: number
  output_tokens: number
  cached_tokens: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  usage?: UsageData
}

interface CostEntry {
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  inputCostUSD: number
  cachedCostUSD: number
  outputCostUSD: number
  totalCostUSD: number
  inputCostINR: number
  cachedCostINR: number
  outputCostINR: number
  totalCostINR: number
}

const PRICING = {
  input: 0.15 / 1_000_000,
  cached: 0.075 / 1_000_000,
  output: 0.60 / 1_000_000
}

function AIChat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCostTable, setShowCostTable] = useState(false)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [rateLoading, setRateLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchExchangeRate = async () => {
    setRateLoading(true)
    try {
      const rate = await getUSDToINRRate()
      setExchangeRate(rate)
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error)
    } finally {
      setRateLoading(false)
    }
  }

  useEffect(() => {
    if (showCostTable) {
      fetchExchangeRate()
    }
  }, [showCostTable])

  const calculateCosts = (usage: UsageData, rate: number): CostEntry => {
    const inputTokens = usage.input_tokens
    const outputTokens = usage.output_tokens
    const cachedTokens = usage.cached_tokens || 0
    const nonCachedInputTokens = inputTokens - cachedTokens

    const inputCostUSD = nonCachedInputTokens * PRICING.input
    const cachedCostUSD = cachedTokens * PRICING.cached
    const outputCostUSD = outputTokens * PRICING.output
    const totalCostUSD = inputCostUSD + cachedCostUSD + outputCostUSD

    return {
      inputTokens,
      outputTokens,
      cachedTokens,
      inputCostUSD,
      cachedCostUSD,
      outputCostUSD,
      totalCostUSD,
      inputCostINR: inputCostUSD * rate,
      cachedCostINR: cachedCostUSD * rate,
      outputCostINR: outputCostUSD * rate,
      totalCostINR: totalCostUSD * rate
    }
  }

  const totalStats = messages.reduce((acc, msg) => {
    if (msg.usage && exchangeRate) {
      const costs = calculateCosts(msg.usage, exchangeRate)
      return {
        totalInputTokens: acc.totalInputTokens + costs.inputTokens,
        totalOutputTokens: acc.totalOutputTokens + costs.outputTokens,
        totalCachedTokens: acc.totalCachedTokens + costs.cachedTokens,
        totalCostUSD: acc.totalCostUSD + costs.totalCostUSD,
        totalCostINR: acc.totalCostINR + costs.totalCostINR
      }
    }
    return acc
  }, { totalInputTokens: 0, totalOutputTokens: 0, totalCachedTokens: 0, totalCostUSD: 0, totalCostINR: 0 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const data = await sendAIChatMessage(input.trim())
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        usage: {
          input_tokens: data.usage.input_tokens,
          output_tokens: data.usage.output_tokens,
          cached_tokens: data.usage.input_tokens_details?.cached_tokens || 0
        }
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setSidebarOpen(false)
  }

  const handleSelectChat = (chatId: string) => {
    // In real app, load chat by ID
    console.log('Selected chat:', chatId)
    setSidebarOpen(false)
  }

  return (
    <div className="h-screen bg-neutral-900 text-gray-100 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-neutral-800 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-neutral-700 rounded-lg transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-semibold">AI Assistant</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-neutral-700 rounded-lg transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Cost Table Modal */}
        {showCostTable && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCostTable(false)}>
            <div className="bg-neutral-800 rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Token Usage & Cost Report</h2>
                  {exchangeRate && (
                    <p className="text-sm text-gray-400 mt-1">
                      1 USD = ₹{exchangeRate.toFixed(2)} • Updated: {new Date().toLocaleTimeString()}
                      <button
                        onClick={fetchExchangeRate}
                        disabled={rateLoading}
                        className="ml-2 text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
                      >
                        {rateLoading ? 'Refreshing...' : '(Refresh)'}
                      </button>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowCostTable(false)}
                  className="p-2 hover:bg-neutral-700 rounded-lg transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-auto flex-1">
                {messages.filter(m => m.usage).length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left py-2 px-3 font-medium text-gray-400">#</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-400">Input Tokens</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-400">Cached Tokens</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-400">Output Tokens</th>
                        <th className="text-right py-2 px-3 font-medium text-emerald-400">Input Cost</th>
                        <th className="text-right py-2 px-3 font-medium text-emerald-400">Cached Cost</th>
                        <th className="text-right py-2 px-3 font-medium text-emerald-400">Output Cost</th>
                        <th className="text-right py-2 px-3 font-medium text-emerald-400">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((msg, idx) => {
                        if (!msg.usage || !exchangeRate) return null
                        const costs = calculateCosts(msg.usage, exchangeRate)
                        return (
                          <tr key={idx} className="border-b border-neutral-700/50">
                            <td className="py-2 px-3">{idx + 1}</td>
                            <td className="text-right py-2 px-3">{costs.inputTokens}</td>
                            <td className="text-right py-2 px-3 text-emerald-400">{costs.cachedTokens}</td>
                            <td className="text-right py-2 px-3">{costs.outputTokens}</td>
                            <td className="text-right py-2 px-3 text-emerald-400">₹{costs.inputCostINR.toFixed(4)} / ${costs.inputCostUSD.toFixed(8)}</td>
                            <td className="text-right py-2 px-3 text-emerald-400">₹{costs.cachedCostINR.toFixed(4)} / ${costs.cachedCostUSD.toFixed(8)}</td>
                            <td className="text-right py-2 px-3 text-emerald-400">₹{costs.outputCostINR.toFixed(4)} / ${costs.outputCostUSD.toFixed(8)}</td>
                            <td className="text-right py-2 px-3 font-medium text-emerald-400">₹{costs.totalCostINR.toFixed(4)} / ${costs.totalCostUSD.toFixed(8)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-neutral-700/30 font-semibold">
                        <td className="py-2 px-3">Total</td>
                        <td className="text-right py-2 px-3">{totalStats.totalInputTokens}</td>
                        <td className="text-right py-2 px-3 text-emerald-400">{totalStats.totalCachedTokens}</td>
                        <td className="text-right py-2 px-3">{totalStats.totalOutputTokens}</td>
                        <td className="text-right py-2 px-3 text-emerald-400">₹{(totalStats.totalInputTokens * PRICING.input * (exchangeRate || 83)).toFixed(4)} / ${(totalStats.totalInputTokens * PRICING.input).toFixed(8)}</td>
                        <td className="text-right py-2 px-3 text-emerald-400">₹{(totalStats.totalCachedTokens * PRICING.cached * (exchangeRate || 83)).toFixed(4)} / ${(totalStats.totalCachedTokens * PRICING.cached).toFixed(8)}</td>
                        <td className="text-right py-2 px-3 text-emerald-400">₹{(totalStats.totalOutputTokens * PRICING.output * (exchangeRate || 83)).toFixed(4)} / ${(totalStats.totalOutputTokens * PRICING.output).toFixed(8)}</td>
                        <td className="text-right py-2 px-3 font-medium text-emerald-400">₹{totalStats.totalCostINR.toFixed(4)} / ${totalStats.totalCostUSD.toFixed(8)}</td>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <p className="text-center text-gray-500 py-8">No usage data yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 flex flex-col overflow-hidden">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-5">
                <div className="text-emerald-500">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-medium text-gray-100">How can I help you today?</h1>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5">
                <div className="max-w-3xl mx-auto space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex gap-4 p-4 rounded-lg ${message.role === 'user' ? 'bg-neutral-800' : 'bg-neutral-900'}`}>
                      <div className={`flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center ${message.role === 'user' ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
                        {message.role === 'user' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        {message.usage && (
                          <p className="mt-2 text-xs text-gray-500">
                            Tokens: {message.usage.input_tokens} in / {message.usage.output_tokens} out
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4 p-4 rounded-lg bg-neutral-900">
                      <div className="flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center bg-neutral-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '160ms'}}></span>
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '320ms'}}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-5 bg-neutral-900 border-t border-neutral-700">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message AI Assistant..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none text-gray-100 text-sm py-2 px-2 placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="flex-shrink-0 p-2 bg-emerald-500 rounded-md text-white hover:bg-emerald-600 disabled:bg-neutral-600 disabled:cursor-not-allowed transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AIChat