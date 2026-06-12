'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Zap } from 'lucide-react'

interface Message {
  id: number
  role: 'bot' | 'user'
  text: string
  time: string
}

function now() {
  return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

const WELCOME: Message = {
  id: 0,
  role: 'bot',
  text: 'Merhaba! 👋 Kaş & Kalkan Premium Villas\'a hoş geldiniz. Villa kiralama, rezervasyon veya destinasyon hakkında sorularınız için buradayım.',
  time: now(),
}

const DEMO_REPLY =
  '🔒 Bu chatbot şu anda **demo modundadır**.\n\nSatın alımdan sonra firmanızın bilgileri, villa kataloğunuz ve özel yanıt senaryolarınız ile donatılacaktır. Gerçek kullanımda misafirlerinize anında, kişiselleştirilmiş yanıtlar verecektir.'

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async () => {
    const text = input.trim()
    if (!text || typing) return
    setInput('')

    const userMsg: Message = { id: Date.now(), role: 'user', text, time: now() }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)

    await new Promise(r => setTimeout(r, 1100))

    setTyping(false)
    const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: DEMO_REPLY, time: now() }
    setMessages(prev => [...prev, botMsg])
    if (!open) setUnread(n => n + 1)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  // Format markdown-lite bold (**text**)
  const formatText = (text: string) =>
    text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.+?)\*\*/g)
      return (
        <span key={i}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      )
    })

  return (
    <>
      {/* ── Chat Window ── */}
      <div
        className={`fixed bottom-[5.5rem] lg:bottom-24 right-5 sm:right-6 z-50 w-[calc(100vw-40px)] sm:w-[380px] max-h-[560px] bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.22)] border border-[#e8e3da] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-b from-[#071220] to-[#0a1a2e] px-5 py-4 flex items-center gap-3 shrink-0">
          <div className="absolute bottom-0 left-1/3 w-40 h-16 bg-[#c8892a]/15 blur-[30px]" />
          <div className="relative w-10 h-10 bg-[#c8892a] rounded-2xl flex items-center justify-center shadow-[0_4px_14px_rgba(200,137,42,0.5)] shrink-0">
            <Bot size={18} className="text-white" />
          </div>
          <div className="relative flex-1 min-w-0">
            <div className="text-white font-bold text-sm leading-none mb-0.5">Kaş & Kalkan Asistan</div>
            <div className="flex items-center gap-1.5 text-white/45 text-[11px]">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
              Çevrimiçi · Demo Modu
            </div>
          </div>
          <div className="relative flex items-center gap-2">
            <div className="inline-flex items-center gap-1 bg-[#c8892a]/20 border border-[#c8892a]/30 text-[#c8892a] text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
              <Zap size={8} className="fill-current" /> Demo
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#fafaf9]" style={{ scrollbarWidth: 'thin' }}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'bot' && (
                <div className="w-7 h-7 bg-[#c8892a] rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot size={13} className="text-white" />
                </div>
              )}
              <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#c8892a] text-white rounded-tr-sm shadow-[0_4px_12px_rgba(200,137,42,0.3)]'
                      : 'bg-white text-[#1c1712] border border-[#e8e3da] rounded-tl-sm shadow-[0_2px_8px_rgba(28,23,18,0.06)]'
                  }`}
                >
                  {formatText(msg.text)}
                </div>
                <span className="text-[10px] text-[#c4bdb5] px-1" suppressHydrationWarning>{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 bg-[#c8892a] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={13} className="text-white" />
              </div>
              <div className="bg-white border border-[#e8e3da] rounded-2xl rounded-tl-sm px-4 py-3 shadow-[0_2px_8px_rgba(28,23,18,0.06)]">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-[#c8892a]/60 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 px-4 py-3 border-t border-[#e8e3da] bg-white">
          <div className="flex gap-2 items-center bg-[#f7f5f0] border border-[#e8e3da] focus-within:border-[#c8892a]/50 rounded-2xl px-4 py-2.5 transition-colors">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Mesajınızı yazın..."
              className="flex-1 bg-transparent text-sm text-[#1c1712] placeholder-[#c4bdb5] outline-none"
            />
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              className="w-8 h-8 bg-[#c8892a] hover:bg-[#b07820] disabled:bg-[#c8892a]/30 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-sm"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
          <p className="text-[9px] text-center text-[#c4bdb5] mt-2">Demo modu aktif · Gerçek verilerle özelleştirilebilir</p>
        </div>
      </div>

      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`fixed bottom-20 lg:bottom-5 right-5 sm:right-6 z-50 w-14 h-14 bg-[#c8892a] hover:bg-[#b07820] rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(200,137,42,0.5)] hover:shadow-[0_12px_40px_rgba(200,137,42,0.65)] transition-all duration-300 ${open ? 'scale-90' : 'scale-100'}`}
        aria-label="Sohbet aç"
      >
        <div className={`transition-all duration-200 ${open ? 'rotate-0 opacity-100' : 'rotate-0 opacity-100'}`}>
          {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
        </div>

        {/* Unread badge */}
        {!open && unread > 0 && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            {unread}
          </div>
        )}

        {/* Pulse ring */}
        {!open && (
          <div className="absolute inset-0 rounded-2xl bg-[#c8892a]/40 animate-ping" style={{ animationDuration: '2.5s' }} />
        )}
      </button>
    </>
  )
}
