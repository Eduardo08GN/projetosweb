'use client'

import { useEffect, useState } from 'react'
import { Gift } from 'lucide-react'
import { LeadForm } from './LeadForm'

export function ExitIntent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('exitShown')) return
    if (localStorage.getItem('leadCaptured')) return

    const timer = setTimeout(() => {
      const handleMouse = (e: MouseEvent) => {
        if (e.clientY < 10) {
          setShow(true)
          sessionStorage.setItem('exitShown', 'true')
          document.removeEventListener('mouseleave', handleMouse)
        }
      }
      document.addEventListener('mouseleave', handleMouse)

      let mobileTimer: ReturnType<typeof setTimeout>
      if (window.innerWidth < 768) {
        mobileTimer = setTimeout(() => {
          setShow(true)
          sessionStorage.setItem('exitShown', 'true')
        }, 60000)
      }

      return () => {
        document.removeEventListener('mouseleave', handleMouse)
        if (mobileTimer) clearTimeout(mobileTimer)
      }
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!show) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShow(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [show])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setShow(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-[slide-up_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          &times;
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Gift className="w-7 h-7 text-gold" />
          </div>
          <h3 className="text-2xl font-bold text-brand mb-2">
            Espera! Leva um presente.
          </h3>
          <p className="text-text-muted">
            PDF gratuito:{' '}
            <strong className="text-text">
              &quot;50 Expressões que Todo Brasileiro Erra em Inglês&quot;
            </strong>
          </p>
        </div>

        <LeadForm
          bloco="exit-intent"
          ctaText="QUERO O PDF GRÁTIS"
          showWhatsapp={false}
        />

        <button
          onClick={() => setShow(false)}
          className="w-full text-center text-sm text-text-muted mt-4 hover:text-text transition-colors"
        >
          Não, obrigado.
        </button>
      </div>
    </div>
  )
}
