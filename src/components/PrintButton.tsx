'use client'

export default function PrintButton() {
  return (
    <button 
      type="button"
      onClick={() => window.print()}
      className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold tracking-wide transition-all shadow-md text-sm"
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      Request Summary Report
    </button>
  )
}