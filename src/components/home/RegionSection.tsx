'use client'
import { useTranslations } from 'next-intl'
import { Waves, Landmark, UtensilsCrossed, Wind, MapPin } from 'lucide-react'

const photos = {
  main:   '/images/kaputas_beach.png',
  topRight: '/images/patara_dunes.png',
  botRight: '/images/kalkan_gastronomy.png',
}


export function RegionSection() {
  const t = useTranslations('home.region')

  const features = [
    { icon: Waves,           color: '#0ea5e9', title: t('feature1Title'), desc: t('feature1Desc') },
    { icon: Landmark,        color: '#c8892a', title: t('feature2Title'), desc: t('feature2Desc') },
    { icon: UtensilsCrossed, color: '#e05a2b', title: t('feature3Title'), desc: t('feature3Desc') },
    { icon: Wind,            color: '#2d9e8f', title: t('feature4Title'), desc: t('feature4Desc') },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-villa">

        {/* Header — left aligned */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              <MapPin size={11} />
              Bölge
            </div>
            <h2 className="heading-section text-[#1c1712]">{t('title')}</h2>
          </div>
          <p className="text-[#9b9389] max-w-xs text-sm leading-relaxed sm:text-right">
            {t('subtitle')}
          </p>
        </div>

        {/* Main two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-start">

          {/* Left: numbered editorial features */}
          <div>
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group flex gap-4 py-6 border-b border-[#e8e3da] last:border-0 transition-all duration-300 rounded-2xl hover:bg-white hover:px-5 hover:-mx-5 hover:shadow-[0_4px_24px_rgba(28,23,18,0.07)]"
              >
                {/* Big number */}
                <div className="shrink-0 w-8 text-4xl font-black text-[#e8e3da] group-hover:text-[#0e3d6e]/15 transition-colors leading-none select-none pt-1">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon + text */}
                <div className="flex gap-4 items-start">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: f.color + '18' }}
                  >
                    <f.icon size={20} style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1c1712] mb-1.5 tracking-tight">{f.title}</h3>
                    <p className="text-[#9b9389] text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: asymmetric photo bento */}
          <div className="grid grid-cols-5 gap-3" style={{ height: 460 }}>
            {/* Large left photo */}
            <div className="col-span-3 row-span-2 rounded-3xl overflow-hidden h-full">
              <img
                src={photos.main}
                alt="Kaş sahil"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Top-right photo */}
            <div className="col-span-2 rounded-3xl overflow-hidden" style={{ height: 220 }}>
              <img
                src={photos.topRight}
                alt="Deniz manzarası"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Bottom-right photo */}
            <div className="col-span-2 rounded-3xl overflow-hidden" style={{ height: 224 }}>
              <img
                src={photos.botRight}
                alt="Gastronomi"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>


      </div>
    </section>
  )
}
