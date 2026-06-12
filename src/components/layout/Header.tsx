'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Heart, Compass, LayoutDashboard } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CurrencySwitcher } from './CurrencySwitcher'
import { useFavoritesStore } from '@/store/favoritesStore'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const favorites = useFavoritesStore(s => s.favorites)

  const isHome = pathname === `/${locale}`

  useEffect(() => {
    let rafId = 0
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 40))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Show hint on every page load, auto-dismiss after 9 s
  useEffect(() => {
    const show = setTimeout(() => {
      setShowHint(true)
      hintTimer.current = setTimeout(() => setShowHint(false), 9000)
    }, 1800)
    return () => clearTimeout(show)
  }, [])

  const dismissHint = () => {
    if (hintTimer.current) clearTimeout(hintTimer.current)
    setShowHint(false)
  }

  const navLinks = [
    { href: `/${locale}/villas`, label: t('villas') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  const transparent = isHome && !scrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(28,23,18,0.07)]'
      }`}
    >
      <div className="container-villa">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
              transparent ? 'bg-[#c8892a]/30 border border-[#c8892a]/50 text-white' : 'bg-[#c8892a] text-white'
            }`}>
              VR
            </div>
            <div className={`leading-tight hidden sm:block transition-colors ${transparent ? 'text-white' : 'text-[#1c1712]'}`}>
              <div className="text-sm font-bold tracking-tight">Villa Rental</div>
              <div className={`text-[11px] font-normal tracking-wide ${transparent ? 'text-white/70' : 'text-[#9b9389]'}`}>
                v4
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    transparent
                      ? active ? 'bg-white/20 text-white' : 'text-white/85 hover:text-white hover:bg-white/15'
                      : active ? 'bg-[#c8892a]/12 text-[#c8892a] font-semibold' : 'text-[#6b6154] hover:text-[#1c1712] hover:bg-[#f7f5f0]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">

            {/* Wizard CTA */}
            <Link
              href={`/${locale}/wizard`}
              className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                transparent
                  ? 'bg-[#c8892a]/25 text-white hover:bg-[#c8892a]/40 border border-[#c8892a]/50'
                  : 'bg-[#c8892a] text-white hover:bg-[#b07820] shadow-sm'
              }`}
            >
              <Compass size={14} />
              <span className="hidden lg:inline">{t('wizard')}</span>
            </Link>

            {/* ── Admin button + hint tooltip ── */}
            <div className="relative">
              <Link
                href="/admin"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  transparent
                    ? 'border-white/25 text-white/80 hover:bg-white/15 hover:text-white hover:border-white/40'
                    : 'border-[#e8e3da] text-[#6b6154] hover:border-[#c8892a]/40 hover:text-[#c8892a] hover:bg-[#c8892a]/5'
                }`}
              >
                <LayoutDashboard size={13} />
                Admin
              </Link>

              {/* Mobile: icon only */}
              <Link
                href="/admin"
                className={`sm:hidden p-2.5 rounded-xl transition-colors ${
                  transparent ? 'text-white/70 hover:bg-white/15' : 'text-[#9b9389] hover:bg-[#f7f5f0]'
                }`}
              >
                <LayoutDashboard size={17} />
              </Link>

              {/* Hint tooltip */}
              {showHint && (
                <div className="absolute top-full right-0 mt-3 w-60 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Arrow */}
                  <div className="absolute -top-1.5 right-5 w-3 h-3 bg-[#1c1712] rotate-45 rounded-sm" />
                  <div className="relative bg-[#1c1712] text-white rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                    <button
                      onClick={dismissHint}
                      className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center rounded-lg hover:bg-white/15 text-white/50 hover:text-white transition-colors"
                    >
                      <X size={11} />
                    </button>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 bg-[#c8892a] rounded-lg flex items-center justify-center shrink-0">
                        <LayoutDashboard size={10} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-white">Admin Paneli</span>
                    </div>
                    <p className="text-white/65 text-xs leading-relaxed">
                      Villaları, rezervasyonları ve site içeriğini yönetmek için tıklayın.
                    </p>
                    {/* Progress bar — shrinks over 5 s to show time remaining */}
                    <div className="mt-3 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#c8892a] rounded-full"
                        style={{
                          width: '100%',
                          transition: 'width 9s linear',
                          animation: 'none',
                        }}
                        ref={el => { if (el) requestAnimationFrame(() => { el.style.width = '0%' }) }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Favorites */}
            <Link
              href={`/${locale}/account/favorites`}
              className={`relative p-2.5 rounded-xl transition-colors ${
                transparent ? 'text-white hover:bg-white/15' : 'text-[#6b6154] hover:text-[#1c1712] hover:bg-[#f7f5f0]'
              }`}
            >
              <Heart size={19} />
              {favorites.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </Link>

            <div className={transparent ? '[&_button]:text-white [&_button]:hover:bg-white/15' : ''}>
              <CurrencySwitcher />
            </div>
            <div className={transparent ? '[&_button]:text-white [&_button]:hover:bg-white/15' : ''}>
              <LanguageSwitcher />
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                transparent ? 'text-white hover:bg-white/15' : 'text-[#6b6154] hover:bg-[#f7f5f0]'
              }`}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#e8e3da]">
          <nav className="container-villa py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-[#1c1712] hover:bg-[#f7f5f0] rounded-xl text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-3 border-t border-[#e8e3da] flex flex-col gap-2">
              <Link
                href={`/${locale}/wizard`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 bg-[#c8892a] hover:bg-[#b07820] text-white rounded-xl font-semibold text-sm transition-colors"
              >
                <Compass size={16} />
                {t('wizard')}
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 border border-[#e8e3da] hover:bg-[#f7f5f0] text-[#6b6154] rounded-xl font-semibold text-sm transition-colors"
              >
                <LayoutDashboard size={16} />
                Admin Panel
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
