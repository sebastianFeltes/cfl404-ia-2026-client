import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'

// Auth context
import { AuthProvider, useAuth } from './context/AuthContext'

// Layouts
import AppLayout from './layouts/AppLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Páginas públicas (sitio institucional)
import Home from './pages/Home'
import Institucional from './pages/Institucional'
import Cooperadora from './pages/Cooperadora'
import Cookies from './pages/Cookies'
import Privacidad from './pages/Privacidad'
import TerminosCondiciones from './pages/TerminosCondiciones'

// Auth
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

// Páginas del panel administrativo
import Alumnos from './pages/Alumnos'
import Instructores from './pages/Instructores'
import CursosAdmin from './pages/CursosAdmin'

// Cooperadora — Módulo de gestión de pagos de cooperadora y buffet.
// Accesible solo a roles: GOD, ADMIN, DIRECTOR, REGENTE, SECRETARIA, PRECEPTORIA.
import CooperadoraAdmin from './pages/CooperadoraAdmin'

/**
 * Ruta protegida: sin JWT válido redirige a /login y recuerda el destino
 * en location.state para volver ahí después de autenticarse.
 */
function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-100 font-nunito">
        <div className="w-10 h-10 border-4 border-custom-celeste border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-custom-gris-claro">Verificando tu sesión…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

/**
 * ScrollToTop — al cambiar de ruta lleva el scroll al inicio de la página.
 * Si la URL trae un hash (#cursos, #contacto), respeta el desplazamiento a la sección.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

function AppRoutes() {
  
    return (
    <Routes>

      {/* ── Sitio público institucional — bajo AppLayout ── */}
      <Route path='/' element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path='institucional' element={<Institucional />} />
        <Route path='cooperadora' element={<Cooperadora />} />
        <Route path='cursos' element={<Home />} />
        <Route path='cookies' element={<Cookies />} />
        <Route path='privacidad' element={<Privacidad />} />
        <Route path='terminos-condiciones' element={<TerminosCondiciones />} />
        <Route path='contactos' element={
          <div className="flex-grow flex items-center justify-center p-12 text-custom-gris-claro font-nunito text-center">
            <p>Sección Contactos en desarrollo...</p>
          </div>
        } />
      </Route>

      {/* ── Autenticación ── */}
      <Route path='/login' element={<LoginPage />} />

      {/* ── Área autenticada: mismo aside + navbar que el resto del admin ── */}
      <Route element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route path='perfil' element={<ProfilePage />} />
        <Route path='admin' element={<Navigate to="/admin/instructores" replace />} />
        <Route path='admin/instructores' element={<Instructores />} />
        <Route path='admin/alumnos' element={<Alumnos />} />
        <Route path='admin/cursos' element={<CursosAdmin />} />

        {/* Cooperadora — Gestión de pagos mensuales y buffet.
            El control de acceso por rol se hace dentro de CooperadoraAdmin
            y en el Sidebar (que oculta el enlace a roles no autorizados). */}
        <Route path='admin/cooperadora' element={<CooperadoraAdmin />} />

        <Route path='admin/reportes' element={
          <div className="p-2"><h1 className="text-2xl font-semibold text-slate-900 font-roboto">Reportes</h1><p className="text-sm text-slate-500 mt-1">Módulo en desarrollo...</p></div>
        } />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App;
