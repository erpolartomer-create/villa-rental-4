'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react'
import { useBlogStore } from '@/store/blogStore'

export default function AdminBlogPage() {
  const { getPosts, deletePost } = useBlogStore()
  const posts = getPosts()
  const [search, setSearch] = useState('')

  const filtered = posts.filter(p =>
    p.translations.tr.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Blog Yazıları</h2>
          <p className="text-stone-400 text-sm mt-0.5">{posts.length} yazı</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors text-sm"
        >
          <Plus size={16} />
          Yeni Yazı
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-stone-100 p-4 mb-5 flex items-center gap-3">
        <Search size={16} className="text-stone-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Yazı ara..."
          className="flex-1 text-sm focus:outline-none text-stone-700 placeholder-stone-400"
        />
      </div>

      <div className="space-y-3">
        {filtered.map(post => (
          <div key={post.id} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm flex items-center gap-4">
            {post.coverImage && (
              <img src={post.coverImage} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {post.status === 'published' ? 'Yayında' : 'Taslak'}
                </span>
              </div>
              <div className="font-semibold text-stone-800 truncate">{post.translations.tr.title}</div>
              <div className="text-stone-400 text-sm mt-0.5 truncate">{post.translations.tr.excerpt}</div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href={`/tr/blog/${post.slug}`}
                target="_blank"
                className="p-1.5 rounded-lg text-stone-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
              >
                <Eye size={15} />
              </Link>
              <Link
                href={`/admin/blog/${post.id}`}
                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <Edit size={15} />
              </Link>
              <button
                onClick={() => deletePost(post.id)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
