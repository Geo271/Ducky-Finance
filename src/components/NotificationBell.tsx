'use client'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { markAsRead } from '@/app/actions/notification'

export default function NotificationBell({ initialNotifications }: { initialNotifications: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 })
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const unreadCount = initialNotifications.filter(n => !n.is_read).length

  // Ensure portal only runs client-side
  useEffect(() => { setMounted(true) }, [])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      })
    }
    setIsOpen(prev => !prev)
  }

  const handleNotificationClick = async (n: any) => {
    if (!n.is_read) await markAsRead(n.id)
    setIsOpen(false)
    router.push(n.target_url)
  }

  // Dropdown rendered via portal directly on document.body —
  // completely escapes all parent stacking contexts, overflow, transforms, filters
  const dropdown = (
    <div
      style={{
        position: 'fixed',
        top: dropdownPos.top,
        right: dropdownPos.right,
        width: '320px',
        backgroundColor: '#ffffff',
        border: '1px solid #f4f4f5',
        borderRadius: '16px',
        boxShadow: '0 20px 60px -12px rgba(0,0,0,0.18)',
        padding: '8px',
        zIndex: 99999,
      }}
    >
      <p style={{ padding: '8px 16px 4px', fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Notifications
      </p>

      {initialNotifications.length === 0 ? (
        <p style={{ padding: '10px 16px', fontSize: '12px', color: '#a1a1aa' }}>No new alerts.</p>
      ) : (
        initialNotifications.map(n => (
          <div
            key={n.id}
            onClick={() => handleNotificationClick(n)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderRadius: '10px',
              backgroundColor: !n.is_read ? 'rgba(253,242,248,0.5)' : 'transparent',
              marginBottom: '2px',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fafafa')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = !n.is_read ? 'rgba(253,242,248,0.5)' : 'transparent')}
          >
            <p style={{ fontWeight: 700, fontSize: '12px', color: '#18181b', marginBottom: '2px' }}>{n.title}</p>
            <p style={{ fontSize: '10px', color: '#71717a', marginBottom: n.type === 'collaborator_invite' ? '8px' : 0 }}>{n.message}</p>
            {n.type === 'collaborator_invite' && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button style={{ fontSize: '9px', fontWeight: 700, backgroundColor: '#ec4899', color: '#fff', padding: '3px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                  Accept
                </button>
                <button style={{ fontSize: '9px', fontWeight: 700, backgroundColor: '#f4f4f5', color: '#52525b', padding: '3px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                  Decline
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )

  return (
    <div ref={wrapperRef}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="relative p-2 bg-zinc-50 hover:bg-pink-50 border border-zinc-200 hover:border-pink-200 rounded-full transition-all"
      >
        <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && mounted && createPortal(dropdown, document.body)}
    </div>
  )
}