'use client'
import { notFound } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Locale } from '@/types/villa'
import { Clock, Eye, ChevronRight, ArrowLeft, BookOpen, Tag, Share2 } from 'lucide-react'
import { useBlogStore } from '@/store/blogStore'

function readingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(words / 200)
}

export default function BlogPostPage() {
  const params = useParams()
  const locale = useLocale() as Locale
  const slug = params.slug as string
  const { getPosts } = useBlogStore()

  const allPosts = getPosts()
  const post = allPosts.find(p => p.slug === slug)

  if (!post || post.status !== 'published') notFound()

  const tr = post.translations[locale] || post.translations.tr
  const mins = readingTime(tr.content)
  const related = allPosts.filter(p => p.id !== post.id && p.status === 'published').slice(0, 2)

  return (
    <div className="min-h-screen bg-white">

      {/* ── Cinematic Hero ── */}
      <div className="relative h-[55vh] sm:h-[65vh] overflow-hidden">
        <img
          src={post.coverImage}
          alt={tr.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-80 h-40 bg-[#c8892a]/10 blur-[60px]" />

        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0 container-villa pt-24">
          <nav className="flex items-center gap-2 text-white/45 text-sm">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight size={13} />
            <Link href={`/${locale}/blog`} className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight size={13} />
            <span className="text-white/75 line-clamp-1 max-w-xs">{tr.title.substring(0, 45)}{tr.title.length > 45 ? '…' : ''}</span>
          </nav>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 container-villa pb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map(cat => (
              <span key={cat} className="inline-flex items-center gap-1 bg-[#c8892a]/90 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(200,137,42,0.35)]">
                <Tag size={9} /> {cat}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-6 max-w-3xl">
            {tr.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/55 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {new Date(post.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="w-1 h-1 bg-white/25 rounded-full" />
            <span className="flex items-center gap-1.5"><Eye size={13} />{post.viewCount.toLocaleString()} görüntüleme</span>
            <span className="w-1 h-1 bg-white/25 rounded-full" />
            <span className="flex items-center gap-1.5"><BookOpen size={13} />{mins} dakika okuma</span>
          </div>
        </div>
      </div>

      {/* ── Article ── */}
      <div className="container-villa max-w-3xl py-14">
        <div className="relative pl-6 mb-12 pb-12 border-b border-[#e8e3da]">
          <div className="absolute left-0 top-0 bottom-12 w-1 bg-gradient-to-b from-[#c8892a] to-[#c8892a]/20 rounded-full" />
          <p className="text-xl text-[#1c1712] font-medium leading-relaxed italic">{tr.excerpt}</p>
        </div>

        <div
          className="prose prose-lg max-w-none
            prose-headings:font-black prose-headings:text-[#1c1712] prose-headings:tracking-tight prose-headings:leading-tight
            prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5
            prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:text-[#4a4540] prose-p:leading-[1.85] prose-p:mb-6
            prose-a:text-[#c8892a] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#1c1712] prose-strong:font-bold
            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-[#c8892a] prose-blockquote:bg-[#fdf3e3] prose-blockquote:rounded-r-2xl prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:my-8
            prose-ul:text-[#4a4540] prose-ol:text-[#4a4540] prose-li:mb-2
            prose-img:rounded-2xl prose-img:shadow-[0_8px_32px_rgba(28,23,18,0.12)]"
          dangerouslySetInnerHTML={{ __html: tr.content }}
        />

        <div className="mt-16 pt-10 border-t border-[#e8e3da] flex items-center justify-between">
          <Link
            href={`/${locale}/blog`}
            className="group inline-flex items-center gap-2.5 text-[#1c1712] hover:text-[#c8892a] font-semibold transition-colors text-sm"
          >
            <div className="w-9 h-9 bg-[#f7f5f0] group-hover:bg-[#c8892a]/15 rounded-xl flex items-center justify-center transition-colors">
              <ArrowLeft size={15} />
            </div>
            Blog&apos;a Geri Dön
          </Link>
          <div className="flex items-center gap-2 text-[#9b9389] text-xs">
            <Share2 size={13} />
            <span>{post.viewCount.toLocaleString()} kişi okudu</span>
          </div>
        </div>
      </div>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <div className="bg-[#f7f5f0] py-14">
          <div className="container-villa">
            <div className="inline-flex items-center gap-2 bg-[#c8892a]/15 border border-[#c8892a]/30 text-[#c8892a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
              <BookOpen size={11} />
              Diğer Yazılar
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map(p => {
                const ptr = p.translations[locale] || p.translations.tr
                return (
                  <Link
                    key={p.id}
                    href={`/${locale}/blog/${p.slug}`}
                    className="group flex gap-4 bg-white rounded-2xl overflow-hidden border border-[#e8e3da] hover:border-[#c8892a]/30 hover:shadow-[0_8px_32px_rgba(28,23,18,0.10)] p-4 transition-all duration-300"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                      <img src={p.coverImage} alt={ptr.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="text-[#9b9389] text-xs mb-1.5 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(p.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                      </div>
                      <h4 className="font-bold text-[#1c1712] group-hover:text-[#c8892a] transition-colors line-clamp-2 text-sm leading-snug mb-2">{ptr.title}</h4>
                      <div className="flex items-center gap-1 text-[#c8892a] text-xs font-bold">
                        Oku <ArrowLeft size={10} className="rotate-180 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
