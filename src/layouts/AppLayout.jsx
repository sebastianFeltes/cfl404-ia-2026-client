import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function AppLayout() {
    return (
        <div>
            <Navbar />
            <main>

                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default AppLayout