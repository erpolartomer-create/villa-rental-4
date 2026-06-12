'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Currency } from '@/types/villa'

interface CurrencyStore {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: 'EUR',
      setCurrency: (currency) => set({ currency }),
    }),
    { name: 'villa-currency', skipHydration: true }
  )
)
