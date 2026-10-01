import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Startseite from './pages/Startseite'
import PlaceDetail from './pages/PlaceDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import NewPlaceForm from './components/NewPlaceForm'
import User from './pages/User'
import Info from './pages/Info'
import SetPassword from './pages/SetPassword'
import Contact from './pages/Contact'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-layout">
          <Header />
          <Routes>
            <Route path="/" element={<Startseite />} />
            <Route path="/orte/:id" element={<PlaceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrieren" element={<Register />} />
            <Route path="/orte/neu" element={<NewPlaceForm />} />
            <Route path="/user" element={<User />} />
            <Route path="info" element={<Info />} />
            <Route path="/passwort-setzen" element={<SetPassword />} />
            <Route path="/kontakt" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
