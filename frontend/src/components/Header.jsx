import './Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
    const { token, email, logout, username } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate("/")
    }

    return (
        <header className="header">
            <div className="logo"></div>
            <nav>
                <ul>
                    <Link to="/">Startseite</Link> 
                    <Link to="/info">Info</Link>
                    <li><a href="#">Kontakt</a></li>
                </ul>
            </nav>

            {token ? (
                <div className="user-area">
                    <Link to ="/user" className="username">{username}</Link>
                    <button className="login-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            ) : (
                <Link to="/login" className="login-button">Login</Link>
            )}
        </header>
    );
}

export default Header