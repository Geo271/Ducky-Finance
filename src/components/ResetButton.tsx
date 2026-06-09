'use client' // This tells Next.js to treat this as a Client Component

export default function ResetButton() {
  return (
    <button 
      type="submit" 
      className="text-[10px] font-bold text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white transition-colors uppercase tracking-wider px-3 py-2 rounded-xl"
      onClick={(e) => {
        // This browser-based alert is now allowed because this is a Client Component
        if(!confirm('Are you sure you want to permanently wipe all financial data? This cannot be undone.')) {
          e.preventDefault();
        }
      }}
    >
      Reset Data
    </button>
  )
}