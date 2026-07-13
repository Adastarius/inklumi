import './Header.css'

function Header() {
    return (
        <header className="header">
            <div className="logo"></div>
            <nav>
                <ul>
                    <li><a href="#">Startseite</a></li>
                    <li><a href="#">Infos</a></li>
                    <li><a href="#">Kontakt</a></li>
                </ul>
            </nav>
            <button className="login-button">Login</button>
        </header>
    );
}

export default Header;