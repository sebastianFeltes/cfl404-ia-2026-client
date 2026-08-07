import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import './App.css'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/Home'
import Instructores from './pages/Instructores'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DashboardLayout />}>
          <Route index element={<Navigate to="/instructores" replace />} />
          <Route path='instructores' element={<Instructores />} />
          <Route path='cursos' element={<div className="p-2"><h1 className="text-2xl font-semibold text-slate-900 font-roboto">Cursos</h1><p className="text-sm text-slate-500 mt-1">Módulo en desarrollo...</p></div>} />
          <Route path='alumnos' element={<div className="p-2"><h1 className="text-2xl font-semibold text-slate-900 font-roboto">Alumnos</h1><p className="text-sm text-slate-500 mt-1">Módulo en desarrollo...</p></div>} />
          <Route path='reportes' element={<div className="p-2"><h1 className="text-2xl font-semibold text-slate-900 font-roboto">Reportes</h1><p className="text-sm text-slate-500 mt-1">Módulo en desarrollo...</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App