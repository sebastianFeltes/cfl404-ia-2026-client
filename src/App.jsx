import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
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

// Auth
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

// Páginas del panel administrativo
import Alumnos from './pages/Alumnos'
import Instructores from './pages/Instructores'

/** Ruta protegida — redirige a /login si no hay JWT en el contexto */
function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
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
        <Route path='contactos' element={
          <div className="flex-grow flex items-center justify-center p-12 text-custom-gris-claro font-nunito text-center">
            <p>Sección Contactos en desarrollo...</p>
          </div>
        } />
      </Route>

      {/* ── Autenticación ── */}
      <Route path='/login' element={<LoginPage />} />

      {/* ── Perfil del alumno (requiere sesión) ── */}
      <Route path='/perfil' element={
        <PrivateRoute><ProfilePage /></PrivateRoute>
      } />

      {/* ── Panel administrativo — bajo DashboardLayout ── */}
      <Route path='/admin' element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/admin/instructores" replace />} />
        <Route path='instructores' element={<Instructores />} />
        <Route path='alumnos' element={<Alumnos />} />
        <Route path='cursos-admin' element={
          <div className="p-2"><h1 className="text-2xl font-semibold text-slate-900 font-roboto">Cursos</h1><p className="text-sm text-slate-500 mt-1">Módulo en desarrollo...</p></div>
        } />
        <Route path='reportes' element={
          <div className="p-2"><h1 className="text-2xl font-semibold text-slate-900 font-roboto">Reportes</h1><p className="text-sm text-slate-500 mt-1">Módulo en desarrollo...</p></div>
        } />
      </Route>

    </Routes>
  )
}

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App