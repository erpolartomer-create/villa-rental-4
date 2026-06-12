'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SiteSettings {
  siteName: string
  phone: string
  email: string
  whatsapp: string
  address: string
  heroStat1: string // "200+"
  heroStat1Label: string // "Premium Villa"
  heroStat2: string // "5.000+"
  heroStat2Label: string // "Mutlu Misafir"
  heroStat3: string // "10"
  heroStat3Label: string // "Yıllık Deneyim"
  checkinTime: string
  checkoutTime: string
  minStayNights: number
  currency: string
}

const DEFAULTS: SiteSettings = {
  siteName: 'Kaş & Kalkan Premium Villas',
  phone: '+90 532 123 45 67',
  email: 'info@kaskalkan.com',
  whatsapp: '+905321234567',
  address: 'Kaş, Antalya, Türkiye',
  heroStat1: '200+',
  heroStat1Label: 'Premium Villa',
  heroStat2: '5.000+',
  heroStat2Label: 'Mutlu Misafir',
  heroStat3: '10',
  heroStat3Label: 'Yıllık Deneyim',
  checkinTime: '15:00',
  checkoutTime: '11:00',
  minStayNights: 3,
  currency: 'EUR',
}

interface SettingsStore {
  settings: SiteSettings
  updateSettings: (partial: Partial<SiteSettings>) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULTS,
      updateSettings: (partial) =>
        set(state => ({ settings: { ...state.settings, ...partial } })),
      resetSettings: () => set({ settings: DEFAULTS }),
    }),
    { name: 'site-settings', skipHydration: true }
  )
)
