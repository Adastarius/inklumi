import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Startseite from './pages/Startseite'
import OrtDetail from './pages/OrtDetail'
import Login from './pages/Login'
import Registrieren from './pages/Registrieren'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Header />
          <Routes>
            <Route path="/" element={<Startseite />} />
            <Route path="/ort/:id" element={<OrtDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrieren" element={<Registrieren />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
