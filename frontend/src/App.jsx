import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Startseite from './pages/Startseite'
import OrtDetail from './pages/OrtDetail'

function App() {
  return (
    <BrowserRouter>
    <div className="app-layout">
      <Header />
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/ort/:id" element={<OrtDetail />} />
      </Routes>
      <Footer />
    </div>
    </BrowserRouter>
    
  )
}

export default App
