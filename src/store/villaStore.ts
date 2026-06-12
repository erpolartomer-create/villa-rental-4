'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Villa } from '@/types/villa'
import { villas as staticVillas } from '@/lib/data/villas'

interface VillaStore {
  // Admin'de eklenen/düzenlenen villalar
  customVillas: Villa[]
  // Statik datadan silinmek istenen villa ID'leri
  deletedIds: string[]

  addVilla: (villa: Villa) => void
  updateVilla: (villa: Villa) => void
  deleteVilla: (id: string) => void
  // Statik + custom merge, deleted çıkarılmış
  getVillas: () => Villa[]
  getVillaById: (id: string) => Villa | undefined
  getVillaBySlug: (slug: string) => Villa | undefined
  resetToStatic: () => void
}

export const useVillaStore = create<VillaStore>()(
  persist(
    (set, get) => ({
      customVillas: [],
      deletedIds: [],

      addVilla: (villa) =>
        set(state => ({ customVillas: [...state.customVillas, villa] })),

      updateVilla: (villa) =>
        set(state => ({
          customVillas: state.customVillas.some(v => v.id === villa.id)
            ? state.customVillas.map(v => v.id === villa.id ? villa : v)
            : [...state.customVillas, villa],
        })),

      deleteVilla: (id) =>
        set(state => ({
          customVillas: state.customVillas.filter(v => v.id !== id),
          deletedIds: [...state.deletedIds, id],
        })),

      getVillas: () => {
        const { customVillas, deletedIds } = get()
        const customIds = new Set(customVillas.map(v => v.id))
        const deletedSet = new Set(deletedIds)
        return [
          ...staticVillas.filter(v => !customIds.has(v.id) && !deletedSet.has(v.id)),
          ...customVillas.filter(v => !deletedSet.has(v.id)),
        ]
      },

      getVillaById: (id) => {
        const all = get().getVillas()
        return all.find(v => v.id === id)
      },

      getVillaBySlug: (slug) => {
        const all = get().getVillas()
        return all.find(v => v.slug === slug)
      },

      resetToStatic: () => set({ customVillas: [], deletedIds: [] }),
    }),
    { name: 'villa-store', skipHydration: true }
  )
)
