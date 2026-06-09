// src/components/FinBot.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface BotMetrics {
  totalMoney: number
  totalSavings: number
  totalDebt: number
  totalExpenses: number
}

interface Message {
  sender: 'user' | 'bot'
  text: string
  timestamp: string
}

export default function FinBot({ metrics }: { metrics: BotMetrics }) {
  const [isOpen, setIsOpen] = useState(false) // Toggle drawer state
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Mabuhay! I am your financial manager. You can ask me to "make a plan" to save any amount, or check your regular "financial health" indices!',
      timestamp: 'Just now'
    }
  ])
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isOpen, messages])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val)
  }

  const analyzeIntentAndReply = (prompt: string): string => {
    const cleanPrompt = prompt.toLowerCase().trim()
    
    if (cleanPrompt.includes('plan') || cleanPrompt.includes('budget target') || cleanPrompt.includes('how to save')) {
      const numbers = cleanPrompt.match(/\d+/g)
      const targetAmount = numbers && numbers[0] ? Number(numbers[0]) : 30000
      const monthsTimeframe = numbers && numbers[1] ? Number(numbers[1]) : 6

      const monthlyInstallment = targetAmount / monthsTimeframe
      const dailyTarget = monthlyInstallment / 30
      
      let breakdown = `🎯 Savings Plan Target:\n`
      breakdown += `• Goal: ${formatCurrency(targetAmount)} over ${monthsTimeframe} Months.\n`
      breakdown += `• Monthly: ${formatCurrency(monthlyInstallment)}/mo\n`
      breakdown += `• Daily: ${formatCurrency(dailyTarget)}/day\n\n`
      
      if (monthlyInstallment > metrics.totalMoney) {
        breakdown += `⚠️ Note: This installment size exceeds your current liquid pool. Try expanding the timeframe to spread allocations safely.`
      } else {
        breakdown += `🟢 Evaluation: Sustainable. Head to Savings and initialize the target!`
      }
      return breakdown
    }

    if (cleanPrompt.includes('health') || cleanPrompt.includes('status') || cleanPrompt.includes('score')) {
      const netWorth = (metrics.totalMoney + metrics.totalSavings) - metrics.totalDebt
      if (netWorth < 0) {
        return `⚠️ Health Warning: Net balance is negative at ${formatCurrency(netWorth)}. Freeze luxury items and use Debt Management.`
      }
      return `🟢 Nominal: Your framework is secure with a net asset safety margin of ${formatCurrency(netWorth)}.`
    }

    if (cleanPrompt.includes('debt') || cleanPrompt.includes('payoff') || cleanPrompt.includes('spaylater')) {
      if (metrics.totalDebt === 0) return '✨ Excellent standing! Your debt registry is completely clear.'
      const ratio = (metrics.totalDebt / (metrics.totalMoney + 0.01)) * 100
      return `💡 Liabilities Audit: Debt-to-Cash ratio is ${ratio.toFixed(1)}%. Maintain structured paydowns through your dashboard.`
    }

    if (cleanPrompt.includes('savings') || cleanPrompt.includes('save') || cleanPrompt.includes('emergency')) {
      if (metrics.totalSavings === 0) return '🎯 Note: Go initialize a target inside the Savings page to activate your automated 15% database splitting trigger.'
      return `🔒 Reserve Index: You have ${formatCurrency(metrics.totalSavings)} secured across milestones.`
    }

    if (cleanPrompt.includes('summary') || cleanPrompt.includes('report') || cleanPrompt.includes('metrics')) {
      return `📋 Quick Snapshot:\n• Cash: ${formatCurrency(metrics.totalMoney)}\n• Savings: ${formatCurrency(metrics.totalSavings)}\n• Liabilities: ${formatCurrency(metrics.totalDebt)}`
    }

    return '❓ Unrecognized command. Try tapping one of the quick chips below for an automated response matrix.'
  }

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim()) return

    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInput('')

    setTimeout(() => {
      const systemReply = analyzeIntentAndReply(text)
      const botMsg: Message = {
        sender: 'bot',
        text: systemReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botMsg])
    }, 300)
  }

  return (
    <>
      {/* Floating Action Button (FAB) Trigger */}
      <button
  onClick={() => setIsOpen(!isOpen)}
  className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-300 group overflow-hidden"
>
  {isOpen ? (
    <span className="text-xl font-bold">✕</span>
  ) : (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <Image 
        src="/psyduck.png" 
        alt="FinBot Mascot" 
        width={40} 
        height={40} 
        className="object-contain" 
      />
    </div>
  )}
</button>

      {/* Slide-out Overlay Drawer */}
      <div className={`fixed inset-y-0 right-0 z-40 w-full sm:w-[380px] bg-white border-l border-zinc-100 shadow-2xl transition-transform duration-300 ease-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
       {/* Header Section */}
<div className="p-4 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white flex items-center justify-between pt-6 sm:pt-4">
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden">
      <Image src="/psyduck.png" alt="Ducky" width={32} height={32} />
    </div>
    <div>
      <h3 className="font-bold text-xs tracking-wide uppercase text-pink-400">Ducky</h3>
      <p className="text-[10px] text-zinc-400 font-medium">Financial Assistant</p>
    </div>
  </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider px-2 py-1">
            Minimize
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/40">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-xs whitespace-pre-line
                ${msg.sender === 'user' ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white text-zinc-700 border border-zinc-100 rounded-tl-none'}
              `}>
                {msg.text}
              </div>
              <span className="text-[9px] text-zinc-400 font-medium mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Action Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-zinc-100 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          {['Make a plan to save 50000 in 5 months', 'Financial Health', 'Summary'].map((chip) => (
            <button key={chip} onClick={() => handleSend(chip)} className="text-[10px] font-bold text-zinc-500 hover:text-pink-500 bg-zinc-100 hover:bg-pink-50 border border-zinc-200/60 rounded-full px-3 py-1 transition-all">
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Input Deck */}
        <div className="p-3 bg-white border-t border-zinc-100 flex gap-2 mb-safe">
          <input 
            type="text" 
            placeholder="Type 'make a plan' or tap a chip..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all text-zinc-800 placeholder:text-zinc-400"
          />
          <button onClick={() => handleSend()} className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm">
            Send
          </button>
        </div>
      </div>
    </>
  )
}