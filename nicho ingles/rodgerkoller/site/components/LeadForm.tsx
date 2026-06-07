'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'

interface LeadFormProps {
  bloco: 'hero' | 'oferta' | 'lead-magnet' | 'exit-intent'
  ctaText?: string
  showWhatsapp?: boolean
  className?: string
}

interface FormData {
  nome: string
  email: string
  whatsapp: string
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '5511999999999'

const mensagens: Record<string, string> = {
  hero: 'Oi Rodger! Vim do site e quero saber mais sobre o Método Koller.',
  oferta: 'Oi Rodger! Quero garantir minha vaga no Curso Definitivo!',
  'lead-magnet': 'Oi Rodger! Baixei o PDF e quero saber mais sobre o curso completo.',
  'exit-intent': 'Oi Rodger! Quase saí do site mas decidi falar com você.',
}

export function LeadForm({
  bloco,
  ctaText = 'QUERO COMEÇAR AGORA',
  showWhatsapp = true,
  className = '',
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()
  const [fallback, setFallback] = useState(false)

  async function onSubmit(data: FormData) {
    try {
      const params = new URLSearchParams(window.location.search)

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          bloco,
          fonte: bloco === 'exit-intent' ? 'exit-intent' : 'formulario',
          utmSource: params.get('utm_source'),
          utmMedium: params.get('utm_medium'),
          utmCampaign: params.get('utm_campaign'),
        }),
      })

      if (!res.ok) throw new Error()

      localStorage.setItem('leadCaptured', 'true')

      const texto = `${mensagens[bloco]} Sou ${data.nome}.`
      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`
      window.open(waLink, '_blank')
    } catch {
      setFallback(true)
    }
  }

  if (fallback) {
    const texto = mensagens[bloco]
    return (
      <div className={`text-center p-6 ${className}`}>
        <p className="text-lg mb-4">Ops, algo deu errado com o formulário.</p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25d366] text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-[#1ebe5d] transition-colors"
        >
          💬 Inscrever pelo WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-3 ${className}`}>
      <div>
        <input
          {...register('nome', { required: true, minLength: 2 })}
          placeholder="Seu nome"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 outline-none transition-all text-base"
        />
        {errors.nome && (
          <span className="text-red-500 text-sm mt-1">Nome obrigatório</span>
        )}
      </div>

      <div>
        <input
          {...register('email', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          placeholder="Seu melhor email"
          type="email"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 outline-none transition-all text-base"
        />
        {errors.email && (
          <span className="text-red-500 text-sm mt-1">Email inválido</span>
        )}
      </div>

      {showWhatsapp && (
        <div>
          <input
            {...register('whatsapp', { required: showWhatsapp, minLength: 10 })}
            placeholder="WhatsApp com DDD"
            type="tel"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 outline-none transition-all text-base"
          />
          {errors.whatsapp && (
            <span className="text-red-500 text-sm mt-1">
              WhatsApp obrigatório
            </span>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-brand-light transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : ctaText}
      </button>
    </form>
  )
}
