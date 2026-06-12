'use client'
import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Moon, CalendarDays } from 'lucide-react'

const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
const TR_DAYS   = ['Pt','Sa','Ça','Pe','Cu','Ct','Pz']

function toStr(d: Date) { return d.toISOString().split('T')[0] }
function parse(s: string) { const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d) }
function daysInMonth(y:number,m:number){ return new Date(y,m+1,0).getDate() }
function startDow(y:number,m:number){ return (new Date(y,m,1).getDay()+6)%7 } // Monday-first
function nights(a:string,b:string){ return Math.round((parse(b).getTime()-parse(a).getTime())/86400000) }

interface Props {
  checkin:  string
  checkout: string
  onChange: (checkin:string, checkout:string) => void
}

export function DateRangePicker({ checkin, checkout, onChange }: Props) {
  const today = new Date()
  const [leftY, setLeftY] = useState(today.getFullYear())
  const [leftM, setLeftM] = useState(today.getMonth())
  const [hovered, setHovered] = useState('')

  const rightDate = new Date(leftY, leftM+1, 1)
  const rightY = rightDate.getFullYear()
  const rightM = rightDate.getMonth()

  const todayStr = toStr(today)

  const canGoPrev = !(leftY === today.getFullYear() && leftM <= today.getMonth())

  const prevMonth = () => { const d=new Date(leftY,leftM-1,1); setLeftY(d.getFullYear()); setLeftM(d.getMonth()) }
  const nextMonth = () => { const d=new Date(leftY,leftM+1,1); setLeftY(d.getFullYear()); setLeftM(d.getMonth()) }

  const handleClick = useCallback((ds:string) => {
    if (ds < todayStr) return
    if (!checkin || (checkin && checkout)) {
      onChange(ds, '')
    } else {
      if (ds <= checkin) onChange(ds, '')
      else onChange(checkin, ds)
    }
  }, [checkin, checkout, onChange, todayStr])

  const isStart  = (ds:string) => ds === checkin
  const isEnd    = (ds:string) => ds === checkout
  const inRange  = (ds:string) => {
    const end = checkout || hovered
    return !!(checkin && end && ds > checkin && ds < end)
  }
  const isPast   = (ds:string) => ds < todayStr
  const isToday  = (ds:string) => ds === todayStr

  function MonthGrid({ year, month }: { year:number; month:number }) {
    const count  = daysInMonth(year, month)
    const offset = startDow(year, month)
    const cells: (string|null)[] = Array(offset).fill(null)
    for (let i=1; i<=count; i++) cells.push(toStr(new Date(year,month,i)))
    while (cells.length%7!==0) cells.push(null)

    return (
      <div className="flex-1 min-w-0">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {TR_DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-stone-400 uppercase py-1.5 tracking-wider">{d}</div>
          ))}
        </div>
        {/* Cells */}
        <div className="grid grid-cols-7">
          {cells.map((ds, idx) => {
            if (!ds) return <div key={idx}/>
            const past  = isPast(ds)
            const start = isStart(ds)
            const end   = isEnd(ds)
            const range = inRange(ds)
            const tod   = isToday(ds)
            const isStartOrEnd = start || end

            return (
              <div
                key={ds}
                onClick={() => !past && handleClick(ds)}
                onMouseEnter={() => { if (checkin && !checkout) setHovered(ds) }}
                onMouseLeave={() => setHovered('')}
                className={[
                  'relative flex items-center justify-center h-9 select-none',
                  range ? 'bg-[#c8892a]/10' : '',
                  start && !end ? 'rounded-full' : start ? 'rounded-l-full' : end ? 'rounded-r-full' : '',
                ].join(' ')}
              >
                <span className={[
                  'w-8 h-8 flex items-center justify-center rounded-full text-[13px] transition-all duration-100',
                  past          ? 'text-stone-300 cursor-not-allowed' : 'cursor-pointer',
                  isStartOrEnd  ? 'bg-[#c8892a] text-white font-bold shadow-[0_3px_12px_rgba(200,137,42,0.45)]' : '',
                  !past && !isStartOrEnd ? 'hover:bg-[#c8892a]/15 hover:text-[#c8892a]' : '',
                  tod && !isStartOrEnd ? 'ring-2 ring-[#c8892a]/40 text-[#c8892a] font-semibold' : '',
                  range && !isStartOrEnd ? 'text-[#b07820] font-semibold' : '',
                  !past && !isStartOrEnd && !range ? 'text-stone-600' : '',
                ].join(' ')}>
                  {new Date(ds).getDate()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const nightCount = checkin && checkout ? nights(checkin, checkout) : 0

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-stone-50/50">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200 disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={14}/>
        </button>

        <div className="flex items-center gap-6 sm:gap-16">
          <span className="text-sm font-bold text-stone-700">{TR_MONTHS[leftM]} {leftY}</span>
          <span className="hidden sm:block text-sm font-bold text-stone-700">{TR_MONTHS[rightM]} {rightY}</span>
        </div>

        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-all"
        >
          <ChevronRight size={14}/>
        </button>
      </div>

      {/* Grids */}
      <div className="flex gap-4 px-4 pt-3 pb-1">
        <MonthGrid year={leftY} month={leftM}/>
        <div className="hidden sm:block w-px bg-stone-100 shrink-0"/>
        <div className="hidden sm:flex flex-1">
          <MonthGrid year={rightY} month={rightM}/>
        </div>
      </div>

      {/* Summary strip */}
      <div className="mx-4 mb-4 mt-3 pt-3 border-t border-stone-100">
        {checkin && checkout ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Checkin */}
              <div className="flex flex-col items-center bg-[#c8892a]/10 border border-[#c8892a]/20 rounded-xl px-3 py-1.5">
                <span className="text-[9px] font-bold text-[#c8892a] uppercase tracking-wider">Giriş</span>
                <span className="text-sm font-black text-stone-800">
                  {parse(checkin).toLocaleDateString('tr-TR',{day:'numeric',month:'short'})}
                </span>
              </div>
              {/* Nights */}
              <div className="flex items-center gap-1 bg-stone-100 rounded-xl px-3 py-1.5">
                <Moon size={11} className="text-[#c8892a]"/>
                <span className="text-sm font-black text-stone-700">{nightCount}</span>
                <span className="text-xs text-stone-400">gece</span>
              </div>
              {/* Checkout */}
              <div className="flex flex-col items-center bg-[#c8892a]/10 border border-[#c8892a]/20 rounded-xl px-3 py-1.5">
                <span className="text-[9px] font-bold text-[#c8892a] uppercase tracking-wider">Çıkış</span>
                <span className="text-sm font-black text-stone-800">
                  {parse(checkout).toLocaleDateString('tr-TR',{day:'numeric',month:'short'})}
                </span>
              </div>
            </div>
            <button
              onClick={() => onChange('','')}
              className="text-xs text-stone-400 hover:text-rose-500 transition-colors font-medium"
            >
              Temizle
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <CalendarDays size={14} className="text-[#c8892a]"/>
            <span>{!checkin ? 'Giriş tarihini seçin' : 'Çıkış tarihini seçin'}</span>
          </div>
        )}
      </div>
    </div>
  )
}
