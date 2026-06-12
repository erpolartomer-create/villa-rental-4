'use client'
import { useCurrencyStore } from '@/store/currencyStore'
import { CURRENCY_SYMBOLS } from '@/lib/utils'
import { Currency } from '@/types/villa'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const currencies: { code: Currency; label: string }[] = [
  { code: 'EUR', label: 'EUR €' },
  { code: 'USD', label: 'USD $' },
  { code: 'TRY', label: 'TRY ₺' },
]

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrencyStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#f7f5f0] transition-colors text-sm font-medium"
      >
        <span>{CURRENCY_SYMBOLS[currency]}</span>
        <span className="hidden sm:inline">{currency}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        /* Reset text color so dropdown is always readable regardless of header transparency */
        <div className="absolute top-full right-0 mt-1 z-50" style={{ color: '#1c1712' }}>
          <div className="bg-white border border-[#e8e3da] rounded-xl shadow-[0_8px_32px_rgba(28,23,18,0.15)] overflow-hidden min-w-[110px]">
            {currencies.map(c => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setOpen(false) }}
                style={{ color: c.code === currency ? '#0e3d6e' : '#1c1712' }}
                className={`w-full px-3 py-2.5 text-sm text-left transition-colors ${
                  c.code === currency ? 'bg-[#e8f0f8] font-semibold' : 'hover:bg-[#f7f5f0]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
