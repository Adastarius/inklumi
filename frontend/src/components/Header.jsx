import './Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function Header() {
    const { token, logout, username } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    async function handleLogout() {
        await logout()
        navigate("/")
        setMenuOpen(false)
    }

    //Hamburger Menü schließen bei mobilen Geräten
    function closeMenu() {
        setMenuOpen(false)
    }

    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/" onClick={closeMenu} className="logo-link"><img className="logo" src="/logo.png" alt="Logo von Inklumi" /></Link>

                <button
                    className={`hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menü öffnen"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`nav-wrapper ${menuOpen ? 'open' : ''}`}>
                    <nav>
                        <ul>
                            <li><Link to="/" onClick={closeMenu}>Startseite</Link></li> 
                            <li><Link to="/info" onClick={closeMenu}>Info</Link></li>
                            <li><Link to="/kontakt" onClick={closeMenu}>Kontakt</Link></li>
                        </ul>
                    </nav>
                    
                    <div className="account-area">
                        {token ? (
                            <div className="user-area">
                                <Link to ="/user" className="username" onClick={closeMenu}>{username}</Link>
                                <button className="login-button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="login-button" onClick={closeMenu}>Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header