'use client'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { VillaImage } from '@/types/villa'

interface Props {
  images: VillaImage[]
  villaName: string
}

export function VillaGallery({ images, villaName }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const open = (idx: number) => { setCurrent(idx); setLightboxOpen(true) }
  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length)
  const next = () => setCurrent(c => (c + 1) % images.length)

  if (!images.length) return null

  const cover = images[0]
  const others = images.slice(1, 5)

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 sm:h-96 rounded-2xl overflow-hidden">
        {/* Cover - large */}
        <div
          className="col-span-2 row-span-2 cursor-pointer overflow-hidden relative group"
          onClick={() => open(0)}
        >
          <img
            src={cover.url}
            alt={cover.altText}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Others */}
        {others.map((img, i) => (
          <div
            key={img.id}
            className="cursor-pointer overflow-hidden relative group"
            onClick={() => open(i + 1)}
          >
            <img
              src={img.url}
              alt={img.altText}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">+{images.length - 5}</span>
              </div>
            )}
          </div>
        ))}

        {/* Fill empty slots */}
        {Array.from({ length: Math.max(0, 4 - others.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-stone-100" />
        ))}

        {/* Show all button */}
        <button
          onClick={() => open(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white text-stone-700 text-sm font-medium px-3 py-2 rounded-lg shadow-md hover:bg-stone-50 transition-colors z-10"
          style={{ position: 'relative', gridColumn: '4', gridRow: '2', alignSelf: 'end', justifySelf: 'end', zIndex: 10, margin: '0.5rem' }}
        >
          <Camera size={15} />
          {images.length} Fotoğraf
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={20} />
          </button>

          <button
            onClick={prev}
            className="absolute left-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="max-w-5xl w-full max-h-[80vh] flex items-center justify-center">
            <img
              src={images[current].url}
              alt={images[current].altText}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>

          <button
            onClick={next}
            className="absolute right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {current + 1} / {images.length}
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 max-w-xl overflow-x-auto scrollbar-hide px-4">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setCurrent(i)}
                className={`w-14 h-10 rounded-md overflow-hidden shrink-0 transition-all ${i === current ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-80'}`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
