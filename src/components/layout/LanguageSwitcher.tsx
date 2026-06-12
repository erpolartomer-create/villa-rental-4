'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { locales, localeNames, localeFlags } from '@/lib/i18n/config'
import { Locale } from '@/types/villa'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export function LanguageSwitcher({ variant = 'default' }: { variant?: 'default' | 'minimal' }) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-[#f7f5f0] transition-colors text-sm font-medium"
      >
        <span>{localeFlags[locale]}</span>
        {variant === 'default' && <span className="hidden sm:inline">{localeNames[locale]}</span>}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        /* Reset text color so dropdown is always readable regardless of header transparency */
        <div className="absolute top-full right-0 mt-1 z-50" style={{ color: '#1c1712' }}>
          <div className="bg-white border border-[#e8e3da] rounded-xl shadow-[0_8px_32px_rgba(28,23,18,0.15)] overflow-hidden min-w-[140px]">
            {locales.map(loc => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                style={{ color: loc === locale ? '#0e3d6e' : '#1c1712' }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                  loc === locale ? 'bg-[#e8f0f8] font-semibold' : 'hover:bg-[#f7f5f0]'
                }`}
              >
                <span>{localeFlags[loc]}</span>
                <span>{localeNames[loc]}</span>
                {loc === locale && <span className="ml-auto text-[#0e3d6e]">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
