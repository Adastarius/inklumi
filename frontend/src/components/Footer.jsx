import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
    return (
        <footer>
            <p>&copy; 2026 Inklumi</p>
            <nav>
                <ul>
                    <li><Link to="/">Startseite</Link></li> 
                    <li><Link to="/info">Info</Link></li>
                    <li><Link to="/kontakt">Kontakt</Link></li>
                </ul>
            </nav>
        </footer>
    )
}

export default Footer