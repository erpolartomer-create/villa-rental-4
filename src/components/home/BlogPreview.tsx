import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { blogPosts } from '@/lib/data/blog'
import { Locale } from '@/types/villa'
import { ArrowRight, Clock, Eye, BookOpen, Tag, Sparkles } from 'lucide-react'

export function BlogPreview() {
  const t = useTranslations('home.blog')
  const locale = useLocale() as Locale
  const posts = blogPosts.filter(p => p.status === 'published').slice(0, 3)

  const featured = posts[0]
  const secondary = posts.slice(1)

  return (
    <section className="section-padding bg-[#f7f5f0]">
      <div className="container-villa">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              <BookOpen size={11} />
              Blog & Rehberler
            </div>
            <h2 className="heading-section text-[#1c1712]">{t('title')}</h2>
          </div>
          <Link
            href={`/${locale}/blog`}
            className="group hidden sm:inline-flex items-center gap-3 px-6 py-3 bg-[#c8892a]/15 hover:bg-[#c8892a] border border-[#c8892a]/30 hover:border-[#c8892a] text-[#c8892a] hover:text-white font-semibold text-sm rounded-2xl transition-all duration-300 whitespace-nowrap"
          >
            {t('viewAll')}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── Asymmetric Bento Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ── Featured Post ── */}
          {featured && (() => {
            const tr = featured.translations[locale]
            return (
              <Link
                href={`/${locale}/blog/${featured.slug}`}
                className="group relative lg:col-span-3 rounded-3xl overflow-hidden flex flex-col"
                style={{ minHeight: 480 }}
              >
                {/* Full-bleed image */}
                <img
                  src={featured.coverImage}
                  alt={tr.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 gpu-layer"
                  decoding="async"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-black/5" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

                {/* Gold glow */}
                <div className="absolute bottom-0 left-0 w-72 h-48 bg-[#c8892a]/12 blur-[60px]" />

                {/* Top badges */}
                <div className="relative z-10 p-6 flex items-start justify-between">
                  <div className="inline-flex items-center gap-1.5 bg-[#c8892a] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-[0_4px_14px_rgba(200,137,42,0.5)] uppercase tracking-wider">
                    <Sparkles size={9} />
                    Öne Çıkan
                  </div>
                  {featured.categories.slice(0, 1).map(cat => (
                    <span key={cat} className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full border border-white/15">
                      <Tag size={7} /> {cat}
                    </span>
                  ))}
                </div>

                {/* Bottom content */}
                <div className="relative z-10 mt-auto p-6 sm:p-8">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-white/55 text-xs mb-4">
                    <span className="flex items-center gap-1.5">
                      <Clock size={10} />
                      {new Date(featured.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="w-0.5 h-0.5 bg-white/40 rounded-full" />
                    <span className="flex items-center gap-1.5"><Eye size={10} />{featured.viewCount.toLocaleString()}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-white text-2xl sm:text-3xl leading-tight tracking-tight mb-3 group-hover:text-[#e6a83c] transition-colors duration-300">
                    {tr.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-6 max-w-lg">
                    {tr.excerpt}
                  </p>

                  {/* CTA */}
                  <div className="inline-flex items-center gap-2.5 bg-[#c8892a] group-hover:bg-[#b07820] text-white text-sm font-bold px-5 py-3 rounded-2xl transition-all shadow-[0_6px_20px_rgba(200,137,42,0.4)] group-hover:shadow-[0_8px_28px_rgba(200,137,42,0.6)]">
                    {t('readMore')}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })()}

          {/* ── Secondary Cards ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {secondary.map((post) => {
              const tr = post.translations[locale]
              return (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#e8e3da] hover:border-[#c8892a]/25 shadow-[0_2px_16px_rgba(28,23,18,0.06)] hover:shadow-[0_16px_48px_rgba(28,23,18,0.12)] hover:-translate-y-1 transition-all duration-300 flex-1 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ height: 190 }}>
                    <img
                      src={post.coverImage}
                      alt={tr.title}
                      className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500 gpu-layer"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                    {/* Category pill */}
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      {post.categories.slice(0, 1).map(cat => (
                        <span key={cat} className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                          <Tag size={7} /> {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Meta */}
                    <div className="flex items-center gap-2 text-[#9b9389] text-xs mb-3">
                      <span className="flex items-center gap-1"><Clock size={10} />
                        {new Date(post.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="w-0.5 h-0.5 bg-[#9b9389] rounded-full" />
                      <span className="flex items-center gap-1"><Eye size={10} />{post.viewCount.toLocaleString()}</span>
                    </div>

                    <h3 className="font-bold text-[#1c1712] group-hover:text-[#c8892a] transition-colors line-clamp-2 leading-snug mb-2 text-[15px]">
                      {tr.title}
                    </h3>
                    <p className="text-[#9b9389] text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                      {tr.excerpt}
                    </p>

                    <div className="flex items-center gap-1.5 text-[#c8892a] text-sm font-bold mt-auto">
                      {t('readMore')}
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── Mobile CTA ── */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c8892a] hover:bg-[#b07820] text-white text-sm font-bold rounded-2xl transition-all shadow-[0_8px_32px_rgba(200,137,42,0.4)]"
          >
            {t('viewAll')} <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  )
}
