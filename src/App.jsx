import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Institucional from './pages/Institucional'
import Cooperadora from './pages/Cooperadora'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='institucional' element={<Institucional />} />
          <Route path='cooperadora' element={<Cooperadora />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App