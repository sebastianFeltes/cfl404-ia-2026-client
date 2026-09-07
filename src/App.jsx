import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'

import { AuthProvider, useAuth } from './context/AuthContext'
import { canonicalRole } from './utils/roles'
import ErrorBoundary from './components/ErrorBoundary'

import AppLayout from './layouts/AppLayout'
import DashboardLayout from './layouts/DashboardLayout'

import Home from './pages/Home'
import Institucional from './pages/Institucional'
import Cooperadora from './pages/Cooperadora'
import Cookies from './pages/Cookies'
import Privacidad from './pages/Privacidad'
import TerminosCondiciones from './pages/TerminosCondiciones'

import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

import Dashboard from './pages/Dashboard'
import Asistencia from './pages/Asistencia'
import Alumnos from './pages/Alumnos'
import Instructores from './pages/Instructores'
import CursosAdmin from './pages/CursosAdmin'
import CooperadoraAdmin from './pages/CooperadoraAdmin'

const STAFF_ROLES = ['GOD', 'ADMIN', 'DIRECTOR', 'REGENTE', 'SECRETARIA', 'PRECEPTORIA']
const COOPERADORA_ROLES = ['GOD', 'ADMIN', 'DIRECTOR', 'REGENTE', 'SECRETARIA', 'PRECEPTORIA']

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-100 font-nunito">
      <div className="w-10 h-10 border-4 border-custom-celeste border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-semibold text-custom-gris-claro">Verificando tu sesión…</p>
    </div>
  )
}

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingScreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

function RoleRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingScreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const role = canonicalRole(user?.rol)
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/perfil" replace />
  }

  return children
}

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

      <Route path='/login' element={<LoginPage />} />

      <Route element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route path='perfil' element={<ProfilePage />} />
      </Route>

      <Route element={
        <RoleRoute allowedRoles={STAFF_ROLES}>
          <DashboardLayout />
        </RoleRoute>
      }>
        <Route path='admin' element={<Navigate to="/admin/dashboard" replace />} />
        <Route path='admin/dashboard' element={<Dashboard />} />
        <Route path='admin/asistencia' element={<Asistencia />} />
        <Route path='admin/instructores' element={<Instructores />} />
        <Route path='admin/alumnos' element={<Alumnos />} />
        <Route path='admin/cursos' element={<CursosAdmin />} />
      </Route>

      <Route element={
        <RoleRoute allowedRoles={COOPERADORA_ROLES}>
          <DashboardLayout />
        </RoleRoute>
      }>
        <Route path='admin/cooperadora' element={<CooperadoraAdmin />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  )
}

export default App
