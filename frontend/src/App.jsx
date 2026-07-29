import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Startseite from './pages/Startseite'
import PlaceDetail from './pages/PlaceDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import NewPlaceForm from './components/NewPlaceForm'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Header />
          <Routes>
            <Route path="/" element={<Startseite />} />
            <Route path="/orte/:id" element={<PlaceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrieren" element={<Register />} />
            <Route path="/orte/neu" element={<NewPlaceForm />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
