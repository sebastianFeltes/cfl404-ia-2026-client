import { useState, useEffect, useMemo } from 'react'
import { Outlet } from 'react-router'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import StudentAppHeader from '../components/StudentAppHeader'
import { useAuth } from '../context/AuthContext'
import { mapDbRoleToUi } from '../utils/roles'
import { isLearnerRole } from '../components/appNavigation'

export default function DashboardLayout() {
  const { user } = useAuth()

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )

  const userRole = mapDbRoleToUi(user?.rol)
  const learnerLayout = isLearnerRole(user?.rol)
  const puedeEditar = userRole === 'director' || userRole === 'secretaria'

  const outletContext = useMemo(
    () => ({ user, userRole, puedeEditar }),
    [user, userRole, puedeEditar],
  )

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('theme')
  }, [])

  return (
    <div className="flex h-dvh w-screen max-w-full bg-slate-50 overflow-hidden font-nunito">
      {!learnerLayout && (
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      )}

      <div className="flex-1 flex flex-col min-w-0 max-w-full h-full overflow-hidden relative">
        {learnerLayout ? <StudentAppHeader /> : <Navbar />}

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  )
}
