// src/components/CategoryInput.tsx
'use client'

import { useState } from 'react'

export default function CategoryInput() {
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
      <label htmlFor="description" className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
        Category / Description
      </label>

      {isCustom ? (
        <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            type="text"
            id="description"
            name="description"
            autoFocus
            placeholder="Type a custom category..."
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            className="w-full px-4 py-3 pr-20 rounded-xl border border-pink-300 bg-pink-50/30 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all text-sm placeholder:text-pink-300 font-medium"
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
          id="description"
          name="description"
          defaultValue="Food & Dining"
          onChange={handleSelectChange}
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all text-sm appearance-none cursor-pointer font-medium"
        >
          <optgroup label="Income Categories">
            <option value="Allowance">Allowance</option>
            <option value="Salary">Salary</option>
            <option value="Freelance / Sideline">Freelance / Sideline</option>
            <option value="Investments">Investments</option>
          </optgroup>

          <optgroup label="Daily Expenses">
            <option value="Food & Dining">Food & Dining</option>
            <option value="Groceries">Groceries</option>
            <option value="Transportation / Fare">Transportation / Fare</option>
            <option value="Shopping / Luho">Shopping / Luho</option>
            <option value="Entertainment">Entertainment</option>
          </optgroup>

          <optgroup label="Bills & Utilities">
            <option value="Electricity (Meralco)">Electricity (Meralco)</option>
            <option value="Water (Maynilad)">Water (Maynilad)</option>
            <option value="Internet / Load">Internet / Load</option>
            <option value="Rent">Rent</option>
          </optgroup>

          <optgroup label="Custom Actions">
            <option value="ADD_CUSTOM" className="font-bold text-pink-600 bg-pink-50">
              ✨ + Add Custom Category
            </option>
          </optgroup>
        </select>
      )}
    </div>
  )
}