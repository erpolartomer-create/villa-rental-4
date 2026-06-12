'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Home, Calendar, Users, Star, FileText,
  Settings, Search, Image, BarChart3, Menu, X, ChevronRight,
  LogOut, Sparkles, ExternalLink,
} from 'lucide-react'

const navItems = [
  { href: '/admin',              label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/admin/villas',       label: 'Villalar',         icon: Home },
  { href: '/admin/bookings',     label: 'Rezervasyonlar',   icon: Calendar },
  { href: '/admin/calendar',     label: 'Takvim',           icon: Calendar },
  { href: '/admin/customers',    label: 'Müşteriler',       icon: Users },
  { href: '/admin/reviews',      label: 'Değerlendirmeler', icon: Star },
  { href: '/admin/blog',         label: 'Blog',             icon: FileText },
  { href: '/admin/media',        label: 'Medya',            icon: Image },
  { href: '/admin/seo',          label: 'SEO Yönetimi',     icon: Search },
  { href: '/admin/analytics',    label: 'Analitik',         icon: BarChart3 },
  { href: '/admin/content',      label: 'İçerik',           icon: FileText },
  { href: '/admin/settings',     label: 'Ayarlar',          icon: Settings },
]

function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname()

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-stone-900 text-white h-full flex flex-col transition-all duration-300 overflow-hidden`}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-stone-700">
        <div className="w-7 h-7 bg-[#c8892a] rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0">VR</div>
        {!collapsed && (
          <div className="ml-2.5 leading-tight">
            <div className="font-bold text-sm text-white">Villa Rental</div>
            <div className="text-[10px] text-stone-400 font-medium">v4 · Admin</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors group ${
                isActive
                  ? 'bg-[#c8892a] text-white'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} />}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-stone-700">
        <Link
          href="/"
          className="flex items-center gap-3 text-stone-400 hover:text-white text-sm transition-colors px-1"
        >
          <LogOut size={16} />
          {!collapsed && <span>Siteye Dön</span>}
        </Link>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed]       = useState(false)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [showBanner, setShowBanner]     = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!localStorage.getItem('admin-demo-banner-dismissed')) {
      setShowBanner(true)
    }
  }, [])

  const dismissBanner = () => {
    setShowBanner(false)
    localStorage.setItem('admin-demo-banner-dismissed', '1')
  }

  const pageTitle = navItems.find(
    n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href))
  )?.label || 'Admin'

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Mobile sidebar */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebar(false)} />
          <div className="relative z-10 w-64 h-full">
            <Sidebar collapsed={false} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top header */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setCollapsed(!collapsed); setMobileSidebar(!mobileSidebar) }}
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-600"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-stone-800">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c8892a] rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>

        {/* ── Demo info banner ── */}
        {showBanner && (
          <div className="shrink-0 border-t border-[#c8892a]/25 bg-gradient-to-r from-[#fdf8f0] via-white to-[#fdf8f0]">
            <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
              {/* Icon */}
              <div className="w-8 h-8 bg-[#c8892a] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles size={14} className="text-white" />
              </div>

              {/* Text */}
              <p className="flex-1 text-sm text-stone-600 leading-snug min-w-0">
                <span className="font-bold text-stone-800">Demo Admin Panelini İnceliyorsunuz</span>
                <span className="hidden sm:inline text-stone-400 mx-1.5">·</span>
                <span className="hidden sm:inline">
                  Müşteri arayüzünü görmek için{' '}
                  <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[#c8892a] font-semibold hover:underline underline-offset-2"
                  >
                    siteyi buradan ziyaret edebilirsiniz
                    <ExternalLink size={11} />
                  </Link>
                </span>
              </p>

              {/* Mobile site link */}
              <Link
                href="/"
                target="_blank"
                className="sm:hidden shrink-0 text-[#c8892a] text-xs font-semibold flex items-center gap-1"
              >
                Siteye git <ExternalLink size={10} />
              </Link>

              {/* Close */}
              <button
                onClick={dismissBanner}
                aria-label="Kapat"
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
