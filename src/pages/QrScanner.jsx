import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Navigate } from 'react-router'
import { ShieldX } from 'lucide-react'
import { POST } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { canonicalRole, canScanQr } from '../utils/roles'
import { extractAttendanceTokenFromBuffer } from '../lib/attendance-token'
import ScanFeedbackModal from '../components/asistencia/ScanFeedbackModal'

const API_SCAN = '/api/attendance/scan'

function NoAccessScreen() {
  return (
    <div className="min-h-screen bg-custom-azul-oscuro flex flex-col items-center justify-center text-center px-6">
      <div className="p-5 bg-white/10 rounded-2xl border border-white/20 mb-5">
        <ShieldX className="h-16 w-16 text-red-300 mx-auto" />
      </div>
      <h1 className="font-nunito font-extrabold text-3xl text-white mb-2">Acceso restringido</h1>
      <p className="text-white/70 max-w-md text-sm">
        Esta pantalla de ingreso requiere una sesión autorizada para el lector QR.
      </p>
    </div>
  )
}

export default function QrScanner() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const accessRole = canonicalRole(user?.rol)
  const userEmail = user?.correo || user?.email
  const hasAccess = canScanQr(accessRole, userEmail)

  const inputRef = useRef(null)
  const scanQueueRef = useRef(Promise.resolve())
  const feedbackIdRef = useRef(0)
  const [scanBuffer, setScanBuffer] = useState('')
  const [feedbacks, setFeedbacks] = useState([])

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  const dismissFeedback = useCallback((id) => {
    setFeedbacks((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const pushFeedback = useCallback((payload) => {
    feedbackIdRef.current += 1
    setFeedbacks((prev) => [...prev.slice(-2), { id: feedbackIdRef.current, ...payload }])
  }, [])

  const submitToken = useCallback(async (rawToken) => {
    const token = extractAttendanceTokenFromBuffer(rawToken) || String(rawToken ?? '').trim()
    if (!token) return

    scanQueueRef.current = scanQueueRef.current.then(async () => {
      try {
        const response = await POST(API_SCAN, { attendance_token: token })
        pushFeedback({
          type: 'success',
          message: response.message,
          student: response.student,
          results: response.results,
        })
      } catch (err) {
        pushFeedback({
          type: 'error',
          message: err.message || 'Error al registrar asistencia',
        })
      } finally {
        setScanBuffer('')
        focusInput()
      }
    })
  }, [focusInput, pushFeedback])

  const processScanBuffer = useCallback((value) => {
    const token = extractAttendanceTokenFromBuffer(value)
    if (token) {
      setScanBuffer('')
      submitToken(token)
      return true
    }
    return false
  }, [submitToken])

  const handleInputChange = (event) => {
    const value = event.target.value
    if (processScanBuffer(value)) return
    setScanBuffer(value)
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    if (processScanBuffer(scanBuffer)) return
    submitToken(scanBuffer)
  }

  useEffect(() => {
    if (hasAccess) focusInput()
  }, [hasAccess, focusInput])

  useEffect(() => {
    const keepFocus = () => focusInput()
    window.addEventListener('click', keepFocus)
    return () => window.removeEventListener('click', keepFocus)
  }, [focusInput])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-custom-azul-oscuro flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-custom-celeste border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: '/qr' } }} />
  }

  if (!hasAccess) {
    return <NoAccessScreen />
  }

  return (
    <div className="h-dvh w-full bg-gradient-to-b from-[#0f4c81] via-custom-azul-oscuro to-[#0a2f52] text-white flex flex-col font-roboto overflow-hidden">
      {/* Mitad superior: logo + escaneo */}
      <section className="h-1/2 min-h-0 flex flex-col items-center justify-center px-8 py-6 border-b border-white/10">
        <img
          src="/logo_texto_hero.svg"
          alt="CFL 404 Berisso"
          className="h-[clamp(5rem,14vh,9rem)] w-auto drop-shadow-2xl shrink-0"
        />

        <p className="mt-4 mb-6 font-nunito text-[clamp(1rem,2.2vh,1.35rem)] text-white/85 tracking-wide text-center">
          Control de ingreso · Centro de Formación Laboral Nº404
        </p>

        <div className="w-full max-w-3xl">
          <label
            htmlFor="qr-input"
            className="block text-center font-nunito font-extrabold text-[clamp(1.35rem,3.2vh,2rem)] text-white mb-4"
          >
            Escanee el QR de su credencial
          </label>
          <input
            ref={inputRef}
            id="qr-input"
            type="text"
            value={scanBuffer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="CFL404-ATT-..."
            className="w-full px-6 py-[clamp(0.9rem,2vh,1.25rem)] rounded-2xl border-2 border-custom-celeste/60 bg-white/95 text-custom-azul-oscuro text-[clamp(1.1rem,2.4vh,1.5rem)] font-mono text-center shadow-xl focus:outline-none focus:border-custom-amarillo focus:ring-4 focus:ring-custom-amarillo/25 transition-all"
            aria-label="Campo de escaneo QR"
          />
          <p className="mt-3 text-center text-[clamp(0.8rem,1.6vh,0.95rem)] text-white/60">
            Acerque su credencial al lector. El registro es automático al completar el código.
          </p>
        </div>
      </section>

      {/* Mitad inferior: video institucional */}
      <section className="h-1/2 min-h-0 relative bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video_qr_screen.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-label="Video institucional del CFL 404"
        />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0a2f52]/80 to-transparent pointer-events-none" />
      </section>

      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 items-end pointer-events-none max-h-[45vh] overflow-hidden">
        {feedbacks.map((feedback) => (
          <ScanFeedbackModal key={feedback.id} feedback={feedback} onDismiss={dismissFeedback} />
        ))}
      </div>
    </div>
  )
}
