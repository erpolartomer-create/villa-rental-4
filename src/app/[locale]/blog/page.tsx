'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Locale } from '@/types/villa'
import { Clock, Eye, ArrowRight, BookOpen, Tag } from 'lucide-react'
import { useBlogStore } from '@/store/blogStore'

function readingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(words / 200)
}

export default function BlogPage() {
  const t = useTranslations('blog')
  const locale = useLocale() as Locale
  const { getPosts } = useBlogStore()

  const published = getPosts().filter(p => p.status === 'published')
  const [featured, ...rest] = published

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ minHeight: '42vh' }}>
        <div className="absolute inset-0">
          <img
            src="/images/kaputas_beach.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          {/* Gold glow */}
          <div className="absolute bottom-0 left-1/3 w-96 h-48 bg-[#c8892a]/8 blur-[80px]" />
        </div>

        <div className="relative z-10 container-villa flex flex-col justify-end pt-32 pb-14">
          <div className="inline-flex items-center gap-2 bg-[#c8892a]/20 border border-[#c8892a]/40 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5 w-fit">
            <BookOpen size={11} />
            Blog & Rehberler
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4 max-w-2xl">
            {t('title')}
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="container-villa py-14">

        {/* ── Featured post ── */}
        {featured && (() => {
          const tr = featured.translations[locale]
          const mins = readingTime(tr.content)
          return (
            <Link
              href={`/${locale}/blog/${featured.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-5 bg-white rounded-3xl overflow-hidden border border-[#e8e3da] hover:border-[#c8892a]/25 shadow-[0_8px_40px_rgba(28,23,18,0.08)] hover:shadow-[0_20px_64px_rgba(28,23,18,0.14)] transition-all duration-500 mb-14"
            >
              {/* Image */}
              <div className="relative lg:col-span-3 h-64 sm:h-80 lg:h-auto overflow-hidden">
                <img
                  src={featured.coverImage}
                  alt={tr.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
                <div className="absolute top-5 left-5 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#c8892a] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(200,137,42,0.4)]">
                    <BookOpen size={9} /> Öne Çıkan
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-5">
                  {featured.categories.map(cat => (
                    <span key={cat} className="inline-flex items-center gap-1 bg-[#c8892a]/10 border border-[#c8892a]/20 text-[#c8892a] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      <Tag size={8} /> {cat}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl lg:text-3xl font-black text-[#1c1712] group-hover:text-[#c8892a] transition-colors leading-tight mb-4">
                  {tr.title}
                </h2>
                <p className="text-[#9b9389] leading-relaxed mb-7 line-clamp-3 text-sm">
                  {tr.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[#9b9389] text-xs mb-8">
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} />
                    {new Date(featured.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="w-1 h-1 bg-[#c8892a]/40 rounded-full" />
                  <span className="flex items-center gap-1.5"><Eye size={11} />{featured.viewCount.toLocaleString()}</span>
                  <span className="w-1 h-1 bg-[#c8892a]/40 rounded-full" />
                  <span>{mins} dk okuma</span>
                </div>

                <div className="inline-flex items-center gap-2.5 bg-[#c8892a] group-hover:bg-[#b07820] text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all w-fit shadow-[0_8px_24px_rgba(200,137,42,0.35)] group-hover:shadow-[0_12px_32px_rgba(200,137,42,0.5)]">
                  {t('readMore')}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          )
        })()}

        {/* ── All posts grid ── */}
        {rest.length > 0 && (
          <>
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
              <BookOpen size={11} />
              Tüm Yazılar
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map(post => {
                const tr = post.translations[locale]
                const mins = readingTime(tr.content)
                return (
                  <Link
                    key={post.id}
                    href={`/${locale}/blog/${post.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-[#e8e3da] hover:border-[#c8892a]/25 shadow-[0_2px_16px_rgba(28,23,18,0.06)] hover:shadow-[0_16px_48px_rgba(28,23,18,0.12)] hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={tr.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex gap-1.5">
                        {post.categories.slice(0, 1).map(cat => (
                          <span key={cat} className="bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-[#9b9389] text-xs mb-3">
                        <span className="flex items-center gap-1"><Clock size={10} />{new Date(post.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                        <span className="w-0.5 h-0.5 bg-[#9b9389] rounded-full" />
                        <span className="flex items-center gap-1"><Eye size={10} />{post.viewCount.toLocaleString()}</span>
                        <span className="w-0.5 h-0.5 bg-[#9b9389] rounded-full" />
                        <span>{mins} dk</span>
                      </div>

                      <h3 className="font-bold text-[#1c1712] group-hover:text-[#c8892a] transition-colors line-clamp-2 mb-2 text-base leading-snug">
                        {tr.title}
                      </h3>
                      <p className="text-[#9b9389] text-sm line-clamp-2 mb-5 leading-relaxed">
                        {tr.excerpt}
                      </p>

                      <div className="flex items-center gap-1.5 text-[#c8892a] text-sm font-bold">
                        {t('readMore')}
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
