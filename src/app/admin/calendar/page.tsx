'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useVillaStore } from '@/store/villaStore'
import { useBookingsStore } from '@/store/bookingsStore'
import { Booking } from '@/types/villa'
import {
  ChevronLeft, ChevronRight, Calendar, Users, Home, Filter,
  Plus, X, Trash2, Save,
} from 'lucide-react'
import { DateRangePicker } from '@/components/admin/DateRangePicker'

const MONTHS     = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
const DAYS_SHORT = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz']

const DEMO_BOOKINGS = [
  { id:'D001', villaId:'v001', guestName:'Mehmet Aydın',   checkinDate:'2026-06-05', checkoutDate:'2026-06-12', status:'confirmed' as const },
  { id:'D002', villaId:'v002', guestName:'Sarah Thompson', checkinDate:'2026-06-10', checkoutDate:'2026-06-17', status:'pending'   as const },
  { id:'D003', villaId:'v003', guestName:'Dmitry K.',      checkinDate:'2026-06-18', checkoutDate:'2026-06-25', status:'confirmed' as const },
  { id:'D004', villaId:'v001', guestName:'Anna Müller',    checkinDate:'2026-07-02', checkoutDate:'2026-07-09', status:'confirmed' as const },
  { id:'D005', villaId:'v005', guestName:'James Taylor',   checkinDate:'2026-07-15', checkoutDate:'2026-07-28', status:'confirmed' as const },
  { id:'D006', villaId:'v002', guestName:'Fatma Kaya',     checkinDate:'2026-05-28', checkoutDate:'2026-06-04', status:'completed' as const },
  { id:'D007', villaId:'v004', guestName:'Marco Rossi',    checkinDate:'2026-06-20', checkoutDate:'2026-06-27', status:'pending'   as const },
  { id:'D008', villaId:'v003', guestName:'Li Wei',         checkinDate:'2026-05-30', checkoutDate:'2026-06-06', status:'confirmed' as const },
]

const STATUS_CFG: Record<string,{bg:string;dot:string;badge:string;label:string}> = {
  confirmed: { bg:'bg-emerald-500', dot:'bg-emerald-500', badge:'bg-emerald-100 text-emerald-700', label:'Onaylı' },
  pending:   { bg:'bg-amber-400',   dot:'bg-amber-400',   badge:'bg-amber-100 text-amber-700',     label:'Beklemede' },
  completed: { bg:'bg-stone-400',   dot:'bg-stone-400',   badge:'bg-stone-100 text-stone-500',     label:'Tamamlandı' },
  cancelled: { bg:'bg-rose-400',    dot:'bg-rose-400',    badge:'bg-rose-100 text-rose-600',       label:'İptal' },
}

type DisplayBooking = { id:string; villaId:string; guestName:string; checkinDate:string; checkoutDate:string; status:string; isStore?:boolean }

function toDateStr(y:number,m:number,d:number){ return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` }
function firstDayOfMonth(y:number,m:number){ const d=new Date(y,m,1).getDay(); return d===0?6:d-1 }
function daysInMonth(y:number,m:number){ return new Date(y,m+1,0).getDate() }
function nightsBetween(ci:string,co:string){ return Math.round((new Date(co).getTime()-new Date(ci).getTime())/86400000) }

const EMPTY_FORM = { villaId:'', guestName:'', guestEmail:'', guestPhone:'', checkinDate:'', checkoutDate:'', status:'confirmed', notes:'' }

// Defined OUTSIDE AdminCalendarPage — prevents remount on every render (focus loss bug)
function FormField({
  label, value, onChange, type = 'text', required = false, error, children,
}: {
  label: string
  value?: string
  onChange?: (v: string) => void
  type?: string
  required?: boolean
  error?: string
  children?: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children ?? (
        <input
          type={type}
          value={value ?? ''}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors ${
            error ? 'border-rose-300 bg-rose-50' : 'border-stone-200 focus:border-[#c8892a]'
          }`}
        />
      )}
      {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

interface VillaOption { id: string; name: string }

function VillaSearch({
  villas, value, onChange, error,
}: {
  villas: VillaOption[]
  value: string
  onChange: (id: string) => void
  error?: string
}) {
  const [query, setQuery]   = useState('')
  const [open, setOpen]     = useState(false)
  const wrapRef             = useRef<HTMLDivElement>(null)

  const selected  = villas.find(v => v.id === value)
  const filtered  = villas.filter(v =>
    v.name.toLowerCase().includes(query.toLowerCase())
  )

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (id: string, name: string) => {
    onChange(id)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
        Villa <span className="text-rose-400">*</span>
      </label>

      {/* Trigger input */}
      <div
        className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 cursor-text transition-colors ${
          error ? 'border-rose-300 bg-rose-50' : open ? 'border-[#c8892a]' : 'border-stone-200 hover:border-stone-300'
        }`}
        onClick={() => { setOpen(true); setTimeout(() => wrapRef.current?.querySelector('input')?.focus(), 10) }}
      >
        {!open && selected ? (
          <span className="flex-1 text-sm text-stone-800 truncate">{selected.name}</span>
        ) : (
          <input
            type="text"
            value={query}
            placeholder={selected ? selected.name : 'Villa ara...'}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            className="flex-1 text-sm bg-transparent outline-none text-stone-800 placeholder-stone-400 min-w-0"
          />
        )}
        <svg className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-2xl shadow-lg z-50 overflow-hidden max-h-52 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-stone-400 text-center">Villa bulunamadı</div>
          ) : (
            filtered.map(v => (
              <button
                key={v.id}
                type="button"
                onMouseDown={e => { e.preventDefault(); select(v.id, v.name) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                  v.id === value
                    ? 'bg-[#c8892a]/10 text-[#c8892a] font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {v.id === value && (
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                )}
                <span className="truncate">{v.name}</span>
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function AdminCalendarPage() {
  const now = new Date()
  const [year, setYear]       = useState(now.getFullYear())
  const [month, setMonth]     = useState(now.getMonth())
  const [villaFilter, setVillaFilter] = useState('all')
  const [view, setView]       = useState<'month'|'list'>('month')

  // Modal state
  const [modal, setModal]     = useState<null|'add'|'detail'>(null)
  const [form, setForm]       = useState(EMPTY_FORM)
  const [detailBooking, setDetailBooking] = useState<DisplayBooking|null>(null)
  const [saving, setSaving]   = useState(false)
  const [errors, setErrors]   = useState<Partial<typeof EMPTY_FORM>>({})

  const { getVillas } = useVillaStore()
  const { bookings: storeBookings, addBooking, deleteBooking } = useBookingsStore()
  const allVillas = getVillas().filter(v => v.status === 'active')

  const allBookings = useMemo<DisplayBooking[]>(() => {
    const storeIds = new Set(storeBookings.map(b => b.id))
    const demo = DEMO_BOOKINGS.filter(d => !storeIds.has(d.id))
    const combined: DisplayBooking[] = [
      ...demo,
      ...storeBookings.map(b => ({
        id: b.id, villaId: b.villaId, guestName: b.guestName,
        checkinDate: b.checkinDate, checkoutDate: b.checkoutDate,
        status: b.status, isStore: true,
      })),
    ]
    return villaFilter === 'all' ? combined : combined.filter(b => b.villaId === villaFilter)
  }, [storeBookings, villaFilter])

  const getVillaName = (id:string) => allVillas.find(v => v.id === id)?.translations.tr.name || id

  const prevMonth = () => { if(month===0){setMonth(11);setYear(y=>y-1)}else setMonth(m=>m-1) }
  const nextMonth = () => { if(month===11){setMonth(0);setYear(y=>y+1)}else setMonth(m=>m+1) }

  const days   = daysInMonth(year, month)
  const offset = firstDayOfMonth(year, month)
  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate())

  const getBookingsForDay = (day:number) => {
    const ds = toDateStr(year, month, day)
    return allBookings.filter(b => ds >= b.checkinDate && ds < b.checkoutDate)
  }

  const monthStart = `${year}-${String(month+1).padStart(2,'0')}-01`
  const monthEnd   = `${year}-${String(month+1).padStart(2,'0')}-${String(days).padStart(2,'0')}`
  const thisMonth  = allBookings.filter(b => b.checkinDate <= monthEnd && b.checkoutDate >= monthStart)

  const listBookings = allBookings
    .filter(b => b.checkoutDate >= todayStr)
    .sort((a,b) => a.checkinDate.localeCompare(b.checkinDate))

  // ── Open modal helpers ──
  const openAdd = (dateStr='') => {
    setForm({ ...EMPTY_FORM, checkinDate: dateStr })
    setErrors({})
    setModal('add')
  }
  const openDetail = (b: DisplayBooking) => { setDetailBooking(b); setModal('detail') }
  const closeModal = () => { setModal(null); setDetailBooking(null) }

  // ── Validate & save ──
  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {}
    if (!form.villaId)      e.villaId     = 'Villa seçin'
    if (!form.guestName.trim()) e.guestName = 'Misafir adı gerekli'
    if (!form.checkinDate)  e.checkinDate  = 'Giriş tarihi gerekli'
    if (!form.checkoutDate) e.checkoutDate = 'Çıkış tarihi gerekli'
    if (form.checkinDate && form.checkoutDate && form.checkoutDate <= form.checkinDate)
      e.checkoutDate = 'Çıkış, girişten sonra olmalı'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    const villa = allVillas.find(v => v.id === form.villaId)
    const nights = nightsBetween(form.checkinDate, form.checkoutDate)
    const newBooking: Booking = {
      id: `M-${Date.now()}`,
      villaId: form.villaId,
      villaName: villa?.translations.tr.name || form.villaId,
      checkinDate: form.checkinDate,
      checkoutDate: form.checkoutDate,
      nights,
      adults: 2,
      children: 0,
      babies: 0,
      totalPrice: 0,
      cleaningFee: 0,
      discountAmount: 0,
      status: form.status as Booking['status'],
      specialRequests: form.notes,
      guestName: form.guestName,
      guestEmail: form.guestEmail,
      guestPhone: form.guestPhone,
      createdAt: new Date().toISOString(),
    }
    addBooking(newBooking)
    setSaving(false)
    closeModal()
  }

  const handleDelete = (id: string) => {
    deleteBooking(id)
    closeModal()
  }

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Rezervasyon Takvimi</h2>
          <p className="text-stone-400 text-sm mt-0.5">{thisMonth.length} rezervasyon bu ay</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-stone-100 rounded-xl p-1 gap-1">
            <button onClick={() => setView('month')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${view==='month'?'bg-white text-stone-700 shadow-sm':'text-stone-400 hover:text-stone-600'}`}>
              <Calendar size={12}/> Ay
            </button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${view==='list'?'bg-white text-stone-700 shadow-sm':'text-stone-400 hover:text-stone-600'}`}>
              <Filter size={12}/> Liste
            </button>
          </div>
          <select
            value={villaFilter}
            onChange={e => setVillaFilter(e.target.value)}
            className="border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#c8892a] text-stone-700 bg-white"
          >
            <option value="all">Tüm Villalar</option>
            {allVillas.slice(0,10).map(v => <option key={v.id} value={v.id}>{v.translations.tr.name}</option>)}
          </select>
          <button
            onClick={() => openAdd()}
            className="flex items-center gap-2 px-4 py-2 bg-[#c8892a] hover:bg-[#b07820] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
          >
            <Plus size={15}/> Rezervasyon Ekle
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Bu Ay Toplam', value:thisMonth.length, icon:Calendar, color:'text-[#c8892a] bg-[#c8892a]/10' },
          { label:'Onaylı',       value:thisMonth.filter(b=>b.status==='confirmed').length, icon:Home, color:'text-emerald-600 bg-emerald-50' },
          { label:'Beklemede',    value:thisMonth.filter(b=>b.status==='pending').length,   icon:Users, color:'text-amber-600 bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={17}/></div>
            <div>
              <div className="text-xl font-black text-stone-800">{s.value}</div>
              <div className="text-xs text-stone-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Month View ── */}
      {view === 'month' && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <button onClick={prevMonth} className="w-8 h-8 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-500 transition-colors"><ChevronLeft size={16}/></button>
            <h3 className="font-bold text-stone-800">{MONTHS[month]} {year}</h3>
            <button onClick={nextMonth} className="w-8 h-8 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-500 transition-colors"><ChevronRight size={16}/></button>
          </div>

          <div className="grid grid-cols-7 border-b border-stone-100 bg-stone-50/60">
            {DAYS_SHORT.map(d => (
              <div key={d} className="py-2.5 text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {Array.from({length:offset}).map((_,i) => (
              <div key={`e${i}`} className="min-h-[92px] border-b border-r border-stone-50 bg-stone-50/40"/>
            ))}
            {Array.from({length:days}).map((_,i) => {
              const day = i+1
              const ds  = toDateStr(year,month,day)
              const dayBookings = getBookingsForDay(day)
              const isToday = ds === todayStr
              const isPast  = ds < todayStr
              const isWknd  = ((offset+i)%7) >= 5
              return (
                <div
                  key={day}
                  onClick={() => !isPast && openAdd(ds)}
                  className={`min-h-[92px] border-b border-r border-stone-50 p-1.5 group transition-colors ${
                    isToday ? 'bg-[#c8892a]/5' : isPast ? 'bg-stone-50/30' : isWknd ? 'bg-stone-50/50 cursor-pointer hover:bg-stone-100/60' : 'cursor-pointer hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      isToday ? 'bg-[#c8892a] text-white' : isPast ? 'text-stone-300' : 'text-stone-500'
                    }`}>
                      {day}
                    </div>
                    {!isPast && (
                      <Plus size={11} className="text-stone-300 group-hover:text-[#c8892a] transition-colors opacity-0 group-hover:opacity-100"/>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    {dayBookings.slice(0,2).map((b,bi) => {
                      const cfg = STATUS_CFG[b.status] || STATUS_CFG.confirmed
                      return (
                        <div
                          key={bi}
                          onClick={e => { e.stopPropagation(); openDetail(b) }}
                          title={`${b.guestName} · ${b.checkinDate} → ${b.checkoutDate}`}
                          className={`${cfg.bg} text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md truncate leading-tight cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          {b.guestName.split(' ')[0]}
                        </div>
                      )
                    })}
                    {dayBookings.length > 2 && (
                      <div className="text-[9px] text-stone-400 font-medium px-1">+{dayBookings.length-2}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── List View ── */}
      {view === 'list' && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <span className="font-semibold text-stone-700 text-sm">Yaklaşan Rezervasyonlar</span>
            <span className="text-xs text-stone-400">{listBookings.length} kayıt</span>
          </div>
          {listBookings.length === 0 ? (
            <div className="py-16 text-center text-stone-400 text-sm">Yaklaşan rezervasyon yok</div>
          ) : (
            <div className="divide-y divide-stone-50">
              {listBookings.map(b => {
                const cfg    = STATUS_CFG[b.status] || STATUS_CFG.confirmed
                const nights = nightsBetween(b.checkinDate, b.checkoutDate)
                return (
                  <div key={b.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50/60 transition-colors group">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`}/>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openDetail(b)}>
                      <div className="font-semibold text-stone-700 text-sm truncate">{b.guestName}</div>
                      <div className="text-xs text-stone-400 truncate">{getVillaName(b.villaId)}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-stone-600">
                        {new Date(b.checkinDate).toLocaleDateString('tr-TR',{day:'numeric',month:'short'})}
                        {' → '}
                        {new Date(b.checkoutDate).toLocaleDateString('tr-TR',{day:'numeric',month:'short'})}
                      </div>
                      <div className="text-[10px] text-stone-400">{nights} gece</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                    {b.isStore && (
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-stone-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 size={13}/>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Legend ── */}
      <div className="bg-white rounded-xl border border-stone-100 px-5 py-3 flex flex-wrap items-center gap-4 shadow-sm">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Durum:</span>
        {Object.entries(STATUS_CFG).map(([key,val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${val.dot}`}/>
            <span className="text-xs text-stone-500">{val.label}</span>
          </div>
        ))}
        <span className="text-[10px] text-stone-300 ml-auto">Boş güne tıklayarak hızlı rezervasyon ekleyebilirsiniz</span>
      </div>

      {/* ══════════════════════════════════
          MODAL OVERLAY
      ══════════════════════════════════ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}/>

          {/* ── Add Booking Modal ── */}
          {modal === 'add' && (
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-800">Rezervasyon Ekle</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Takvime manuel rezervasyon girişi</p>
                </div>
                <button onClick={closeModal} className="w-8 h-8 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-400 transition-colors">
                  <X size={16}/>
                </button>
              </div>

              {/* Form */}
              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

                {/* Villa */}
                <VillaSearch
                  villas={allVillas.map(v => ({ id: v.id, name: v.translations.tr.name }))}
                  value={form.villaId}
                  onChange={id => {
                    setForm(f => ({...f, villaId: id}))
                    setErrors(e => ({...e, villaId: undefined}))
                  }}
                  error={errors.villaId}
                />

                {/* Guest name */}
                <FormField
                  label="Misafir Adı Soyadı"
                  required
                  value={form.guestName}
                  onChange={v => setForm(f => ({...f, guestName: v}))}
                  error={errors.guestName}
                />

                {/* Date range picker */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                    Tarih Aralığı <span className="text-rose-400">*</span>
                  </label>
                  <DateRangePicker
                    checkin={form.checkinDate}
                    checkout={form.checkoutDate}
                    onChange={(ci, co) => {
                      setForm(f => ({ ...f, checkinDate: ci, checkoutDate: co }))
                      // Clear date errors when user selects
                      setErrors(e => ({ ...e, checkinDate: undefined, checkoutDate: undefined }))
                    }}
                  />
                  {(errors.checkinDate || errors.checkoutDate) && (
                    <p className="text-rose-500 text-xs mt-1.5">
                      {errors.checkinDate || errors.checkoutDate}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Durum</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['confirmed','pending','completed','cancelled'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm(f => ({...f, status: s}))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                          form.status === s
                            ? `${STATUS_CFG[s].badge} border-current`
                            : 'border-stone-100 text-stone-400 hover:border-stone-200'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${STATUS_CFG[s].dot}`}/>
                        {STATUS_CFG[s].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional fields */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="E-posta"
                    type="email"
                    value={form.guestEmail}
                    onChange={v => setForm(f => ({...f, guestEmail: v}))}
                  />
                  <FormField
                    label="Telefon"
                    value={form.guestPhone}
                    onChange={v => setForm(f => ({...f, guestPhone: v}))}
                  />
                </div>

                <FormField label="Notlar">
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                    rows={2}
                    className="w-full border border-stone-200 focus:border-[#c8892a] rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none transition-colors"
                    placeholder="Özel istekler, notlar..."
                  />
                </FormField>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-stone-100 flex items-center gap-3 justify-end">
                <button onClick={closeModal} className="px-5 py-2.5 border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold text-sm rounded-xl transition-colors">
                  Vazgeç
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#c8892a] hover:bg-[#b07820] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                >
                  <Save size={14}/>
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          )}

          {/* ── Detail Modal ── */}
          {modal === 'detail' && detailBooking && (
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
                <h3 className="font-bold text-stone-800">Rezervasyon Detayı</h3>
                <button onClick={closeModal} className="w-8 h-8 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-400 transition-colors">
                  <X size={16}/>
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* Status badge */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_CFG[detailBooking.status]?.badge || 'bg-stone-100 text-stone-500'}`}>
                    {STATUS_CFG[detailBooking.status]?.label || detailBooking.status}
                  </span>
                  <span className="text-xs text-stone-400">#{detailBooking.id}</span>
                </div>

                <div className="space-y-3">
                  {[
                    { label:'Misafir', value: detailBooking.guestName },
                    { label:'Villa',   value: getVillaName(detailBooking.villaId) },
                    { label:'Giriş',   value: new Date(detailBooking.checkinDate).toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) },
                    { label:'Çıkış',   value: new Date(detailBooking.checkoutDate).toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) },
                    { label:'Süre',    value: `${nightsBetween(detailBooking.checkinDate, detailBooking.checkoutDate)} gece` },
                  ].map(row => (
                    <div key={row.label} className="flex items-start justify-between gap-4">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mt-0.5">{row.label}</span>
                      <span className="text-sm text-stone-700 font-medium text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between gap-3">
                {detailBooking.isStore ? (
                  <button
                    onClick={() => handleDelete(detailBooking.id)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-rose-200 text-rose-500 hover:bg-rose-50 font-semibold text-sm rounded-xl transition-colors"
                  >
                    <Trash2 size={13}/> Sil
                  </button>
                ) : (
                  <span className="text-xs text-stone-400">Demo kayıt</span>
                )}
                <button onClick={closeModal} className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm rounded-xl transition-colors">
                  Kapat
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
