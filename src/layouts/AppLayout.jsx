import { Outlet } from 'react-router'

function AppLayout() {
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout