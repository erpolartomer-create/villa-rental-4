'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BlogPost } from '@/types/villa'
import { blogPosts as staticPosts } from '@/lib/data/blog'

interface BlogStore {
  customPosts: BlogPost[]
  deletedIds: string[]

  addPost: (post: BlogPost) => void
  updatePost: (post: BlogPost) => void
  deletePost: (id: string) => void
  getPosts: () => BlogPost[]
  getPostBySlug: (slug: string) => BlogPost | undefined
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      customPosts: [],
      deletedIds: [],

      addPost: (post) =>
        set(state => ({ customPosts: [...state.customPosts, post] })),

      updatePost: (post) =>
        set(state => ({
          customPosts: state.customPosts.some(p => p.id === post.id)
            ? state.customPosts.map(p => p.id === post.id ? post : p)
            : [...state.customPosts, post],
        })),

      deletePost: (id) =>
        set(state => ({
          customPosts: state.customPosts.filter(p => p.id !== id),
          deletedIds: [...state.deletedIds, id],
        })),

      getPosts: () => {
        const { customPosts, deletedIds } = get()
        const customIds = new Set(customPosts.map(p => p.id))
        const deletedSet = new Set(deletedIds)
        return [
          ...staticPosts.filter(p => !customIds.has(p.id) && !deletedSet.has(p.id)),
          ...customPosts.filter(p => !deletedSet.has(p.id)),
        ]
      },

      getPostBySlug: (slug) => {
        const all = get().getPosts()
        return all.find(p => p.slug === slug)
      },
    }),
    { name: 'blog-store' }
  )
)
