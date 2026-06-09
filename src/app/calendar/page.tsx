// src/app/calendar/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { getCalendarEvents } from '@/app/actions/calendar'
import Link from 'next/link'

interface CalendarEvent {
  id: string
  date: string
  label: string
  type: 'debt' | 'savings'
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  
  // FIXED: State tracking to look up any dynamic date across months and years
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  
  const [selectedDateStr, setSelectedDateStr] = useState<string>('')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [currentNoteInput, setCurrentNoteInput] = useState('')

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  useEffect(() => {
    async function loadData() {
      const data = await getCalendarEvents()
      setEvents(data)
      const savedNotes = localStorage.getItem('jenjen_calendar_notes')
      if (savedNotes) setNotes(JSON.parse(savedNotes))
      setSelectedDateStr(now.toISOString().split('T')[0])
    }
    loadData()
  }, [])

  // Dynamic day calculation matrices for the inspected month view state
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const daysArray: Array<number | null> = []
  for (let i = 0; i < firstDayOfMonth; i++) daysArray.push(null)
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i)

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(prev => prev - 1)
    } else {
      setCurrentMonth(prev => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(prev => prev + 1)
    } else {
      setCurrentMonth(prev => prev + 1)
    }
  }

  const handleDayClick = (day: number) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDateStr(formattedDate)
    setCurrentNoteInput(notes[formattedDate] || '')
  }

  const handleSaveNote = () => {
    const updatedNotes = { ...notes, [selectedDateStr]: currentNoteInput }
    setNotes(updatedNotes)
    localStorage.setItem('jenjen_calendar_notes', JSON.stringify(updatedNotes))
  }

  const getDayEvents = (dayNum: number) => {
    const matchingStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    return events.filter(e => e.date === matchingStr)
  }

  return (
    <div className="min-h-screen bg-[#FCF8F8] text-zinc-800 p-4 md:p-12 font-sans selection:bg-pink-100 selection:text-pink-900">
      
      <header className="mb-6 md:mb-10 max-w-6xl mx-auto flex flex-col gap-2">
        <Link href="/" className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors uppercase tracking-wider mb-2 w-max">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
          Financial <span className="text-pink-500 font-medium">Calendar</span>
        </h1>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 items-start">
        
        {/* Left Side: Month Grid Card */}
        <div className="lg:col-span-3 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-pink-100/60 shadow-xs">
          
          {/* UPDATED: Dynamic Month Switcher Headers Container */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={handlePrevMonth} className="p-2 bg-zinc-50 hover:bg-pink-50 rounded-xl border border-zinc-200/60 text-zinc-600 text-xs font-bold transition-all">
              ← Prev
            </button>
            <h2 className="text-base md:text-lg font-bold text-zinc-800 uppercase tracking-wide">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button onClick={handleNextMonth} className="p-2 bg-zinc-50 hover:bg-pink-50 rounded-xl border border-zinc-200/60 text-zinc-600 text-xs font-bold transition-all">
              Next →
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-1">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {daysArray.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} className="bg-zinc-50/20 rounded-lg min-h-[60px] md:min-h-[95px]" />
              
              const dayEvents = getDayEvents(day)
              const cellDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const hasNote = !!notes[cellDateStr]
              const isSelected = selectedDateStr === cellDateStr

              return (
                <button 
                  key={`day-${day}`} 
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[65px] md:min-h-[95px] p-1.5 md:p-2 bg-white border rounded-xl md:rounded-2xl flex flex-col justify-between items-start transition-all hover:bg-pink-50/20 text-left relative overflow-hidden
                    ${isSelected ? 'border-pink-400 ring-2 ring-pink-100 bg-white' : 'border-zinc-100 bg-white'}
                  `}
                >
                  <span className={`text-[10px] font-bold rounded-md px-1.5 py-0.5 ${isSelected ? 'bg-pink-500 text-white' : 'text-zinc-700 bg-zinc-100'}`}>
                    {day}
                  </span>

                  <div className="w-full space-y-0.5 mt-1">
                    {dayEvents.slice(0, 1).map((e, eIdx) => (
                      <div key={eIdx} className={`text-[8px] font-bold px-1 py-0.5 rounded-md truncate max-w-full
                        ${e.type === 'debt' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}
                      `}>
                        {e.label.split(': ')[1]}
                      </div>
                    ))}
                    {hasNote && dayEvents.length === 0 && (
                      <div className="text-[8px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-1 py-0.5 rounded-md truncate">
                        📝 Memo
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Side: Interactive Action Workspace Panel */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          <div className="bg-white p-5 rounded-2xl md:rounded-3xl border border-pink-100/60 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-zinc-800 text-xs uppercase tracking-wide">Day Inspector</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Target: <span className="font-bold text-zinc-700">{selectedDateStr}</span></p>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {events.filter(e => e.date === selectedDateStr).map((e, eIdx) => (
                <div key={eIdx} className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2
                  ${e.type === 'debt' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'}
                `}>
                  <span>{e.type === 'debt' ? '💸' : '🎯'}</span>
                  <p>{e.label}</p>
                </div>
              ))}
              {events.filter(e => e.date === selectedDateStr).length === 0 && (
                <p className="text-xs text-zinc-400 italic">No system metrics scheduled.</p>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-zinc-100">
              <label htmlFor="note_input" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Custom Day Memos</label>
              <textarea 
                id="note_input"
                placeholder="Append custom financial text reminders..."
                value={currentNoteInput}
                onChange={(e) => setCurrentNoteInput(e.target.value)}
                className="w-full p-3 h-24 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none text-zinc-800 placeholder:text-zinc-400"
              />
              <button type="button" onClick={handleSaveNote} className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs tracking-wide rounded-xl transition-colors shadow-sm mt-1">
                Save Memo
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}