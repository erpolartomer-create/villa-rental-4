'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Sparkles, ArrowRight, CalendarDays, SlidersHorizontal, Wallet, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: CalendarDays,
    title: 'Tarih Seçin',
    desc: 'Check-in ve check-out tarihlerinizi belirleyin',
  },
  {
    icon: SlidersHorizontal,
    title: 'Tercihlerinizi Belirtin',
    desc: 'Konum, kapasite ve istediğiniz özellikler',
  },
  {
    icon: Wallet,
    title: 'Bütçenizi Girin',
    desc: 'Gecelik bütçe aralığınızı ayarlayın',
  },
  {
    icon: CheckCircle2,
    title: 'Eşleşmeleri Görün',
    desc: 'Size özel filtrelenmiş villa listesi',
  },
]

export function WizardCTA() {
  const t = useTranslations('home.wizard')
  const locale = useLocale()

  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed background */}
      <div className="absolute inset-0">
        <img
          src="/images/cat_beachfront.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071220]/70 via-[#0a1a2e]/82 to-[#0a1a2e]/95" />
        {/* Gold accent glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#c8892a]/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10 container-villa py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          <Sparkles size={11} />
          Villa Eşleştirme Sihirbazı
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white mb-5 leading-[1.05] tracking-tight max-w-2xl mx-auto">
          {t('title')}
        </h2>
        <p className="text-white/55 text-lg mb-14 max-w-md mx-auto leading-relaxed">
          {t('subtitle')}
        </p>

        {/* Step cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative bg-white/7 backdrop-blur-md border border-white/10 hover:border-[#c8892a]/40 hover:bg-white/12 rounded-2xl p-5 text-left transition-all duration-300"
            >
              {/* Connector line (hidden on last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-9 -right-1.5 w-3 h-px bg-white/15 z-10" />
              )}
              <div className="w-9 h-9 bg-[#c8892a] group-hover:bg-[#b07820] rounded-xl flex items-center justify-center mb-3 transition-colors shadow-[0_4px_12px_rgba(200,137,42,0.4)]">
                <step.icon size={16} className="text-white" />
              </div>
              <div className="text-white/30 text-[10px] font-black tracking-widest mb-1">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="text-white font-bold text-sm mb-1.5 leading-tight">{step.title}</div>
              <div className="text-white/45 text-xs leading-relaxed">{step.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/${locale}/wizard`}
          className="group inline-flex items-center gap-3 px-9 py-4.5 bg-[#c8892a] hover:bg-[#b07820] text-white font-bold rounded-2xl transition-all text-base shadow-[0_8px_32px_rgba(200,137,42,0.45)] hover:shadow-[0_12px_40px_rgba(200,137,42,0.6)] hover:-translate-y-0.5"
        >
          <Sparkles size={17} />
          {t('startButton')}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="text-white/30 text-xs mt-5">Ücretsiz · Kayıt gerektirmez · 2 dakikada sonuç</p>
      </div>
    </section>
  )
}
