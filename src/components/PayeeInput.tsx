// src/components/PayeeInput.tsx
'use client'

import { useState } from 'react'

export default function PayeeInput() {
  const [isCustom, setIsCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'ADD_CUSTOM') {
      setIsCustom(true)
      setCustomValue('') 
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
        Payee / Sender (Optional)
      </label>
      
      {isCustom ? (
        <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
          <input 
            type="text" 
            name="payee" 
            autoFocus
            placeholder="Type a custom name or business..."
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            className="w-full px-4 py-3 pr-20 rounded-xl border border-pink-300 bg-pink-50/30 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all text-sm placeholder:text-pink-300"
          />
          <button 
            type="button" 
            onClick={() => setIsCustom(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 hover:text-zinc-600 uppercase tracking-wider transition-colors bg-white px-2 py-1 rounded-md border border-zinc-200 shadow-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <select 
          name="payee" 
          defaultValue=""
          onChange={handleSelectChange}
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all text-sm appearance-none cursor-pointer"
        >
          <option value="">Leave blank (None)</option>
          
          <optgroup label="People">
            <option value="Family Member">Family Member</option>
            <option value="Friend">Friend</option>
            <option value="Employer">Employer / Client</option>
          </optgroup>
          
          <optgroup label="Businesses & Platforms">
            <option value="Shopee">Shopee</option>
            <option value="Lazada">Lazada</option>
            <option value="Meralco">Meralco</option>
            <option value="Maynilad">Maynilad</option>
            <option value="Netflix">Netflix</option>
          </optgroup>

          <optgroup label="Create Your Own">
            <option value="ADD_CUSTOM" className="font-bold text-pink-600 bg-pink-50">
              + Add New Payee
            </option>
          </optgroup>
        </select>
      )}
    </div>
  )
}