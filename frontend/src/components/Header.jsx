import './Header.css'

function Header() {
    return (
        <header className="header">
            <nav>
                <ul>
                    <li><a href="#">Startseite</a></li>
                    <li><a href="#">Infos</a></li>
                    <li><a href="#">Kontakt</a></li>
                </ul>
            </nav>
            <button>Login</button>
        </header>
    );
}

export default Header;