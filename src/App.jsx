import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import AppLayout from './layouts/AppLayout'
import Alumnos from './pages/Alumnos'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Alumnos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App