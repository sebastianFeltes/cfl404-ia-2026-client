import React, { useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

function AppLayout() {
  // Sidebar colapsado por defecto al ingresar (modo mini w-20)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState('director')

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50/40">
      {/* Sidebar — panel lateral izquierdo colapsable (modo mini icon-only w-20) */}
      <Sidebar isOpen={sidebarOpen} logoUrl="/logo_texto_lado.svg" />

      {/* Área de contenido principal */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden transition-all duration-300">
        {/* Navbar superior */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userRole={userRole}
          setUserRole={setUserRole}
        />

        {/* Contenido principal scrollable de cada página sin banners sobrantes */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet context={{ userRole, sidebarOpen }} />
        </main>
      </div>
    </div>
  )
}

export default AppLayout