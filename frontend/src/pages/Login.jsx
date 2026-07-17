import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fehler, setFehler] = useState(null)
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setFehler(null)

        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setFehler(data.fehler)
                return
            }

            login(data.token, data.email)
            navigate("/")
        } catch (error) {
            setFehler("Login fehlgeschlagen. Bitte versuch es später erneut.")
        }
    }

    return (
        <main className="auth-page">
            <h1>Anmelden</h1>

            <form onSubmit={handleSubmit} className="auth-formular">
                <label htmlFor="email">E-Mail</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Passwort</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {fehler && (
                    <p role="alert" className="auth-error">
                        {fehler}
                    </p>
                )}

                <button type="submit">Anmelden</button>
            </form>

            <p>
                Noch kein Konto? <Link to="/registrieren">Jetzt registrieren</Link>
            </p>
        </main>
    )
}

export default Login