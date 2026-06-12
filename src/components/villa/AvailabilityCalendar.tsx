'use client'
import { useTranslations } from 'next-intl'
import { DayPicker, DateRange } from 'react-day-picker'
import { useState } from 'react'
import { useBookingStore } from '@/store/bookingStore'
import 'react-day-picker/style.css'

interface Props {
  blockedDates: string[]
  villaId: string
}

export function AvailabilityCalendar({ blockedDates, villaId }: Props) {
  const t = useTranslations('villa')
  const { setDates } = useBookingStore()

  const [range, setRange] = useState<DateRange | undefined>()

  const blocked = blockedDates.map(d => new Date(d))

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange)
    if (selectedRange?.from && selectedRange?.to) {
      setDates(
        selectedRange.from.toISOString().split('T')[0],
        selectedRange.to.toISOString().split('T')[0]
      )
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
      <h3 className="font-bold text-stone-800 text-lg mb-1">{t('availability')}</h3>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5 text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
          {t('availabilityLegend.selected')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-300 inline-block"></span>
          {t('availabilityLegend.booked')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-300 inline-block"></span>
          {t('availabilityLegend.available')}
        </span>
      </div>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        disabled={[
          { before: new Date() },
          ...blocked
        ]}
        modifiers={{ booked: blocked }}
        modifiersClassNames={{ booked: 'day-booked' }}
        className="font-sans text-stone-700"
        styles={{
          root: { fontFamily: 'inherit', width: '100%' },
          months: { display: 'flex', gap: '2rem', flexWrap: 'wrap' },
        }}
      />
    </div>
  )
}
