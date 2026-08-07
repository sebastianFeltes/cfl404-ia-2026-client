import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import './App.css'

// Layouts
import AppLayout from './layouts/AppLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Páginas públicas (sitio institucional)
import Home from './pages/Home'
import Institucional from './pages/Institucional'
import Cooperadora from './pages/Cooperadora'

// Páginas del panel administrativo
import Alumnos from './pages/Alumnos'
import Instructores from './pages/Instructores'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Sitio público institucional — bajo AppLayout con navbar público ── */}
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='institucional' element={<Institucional />} />
          <Route path='cooperadora' element={<Cooperadora />} />
          <Route path='cursos' element={<Home />} />
          <Route path='contactos' element={<div className="flex-grow flex items-center justify-center p-12 text-custom-gris-claro font-nunito text-center"><p>Sección Contactos en desarrollo...</p></div>} />
        </Route>

        {/* ── Panel administrativo — bajo DashboardLayout con sidebar admin ── */}
        <Route path='/admin' element={<DashboardLayout />}>
          <Route index element={<Navigate to="/admin/instructores" replace />} />
          <Route path='instructores' element={<Instructores />} />
          <Route path='alumnos' element={<Alumnos />} />
          <Route path='cursos-admin' element={<div className="p-2"><h1 className="text-2xl font-semibold text-slate-900 font-roboto">Cursos</h1><p className="text-sm text-slate-500 mt-1">Módulo en desarrollo...</p></div>} />
          <Route path='reportes' element={<div className="p-2"><h1 className="text-2xl font-semibold text-slate-900 font-roboto">Reportes</h1><p className="text-sm text-slate-500 mt-1">Módulo en desarrollo...</p></div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App