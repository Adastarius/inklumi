import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Registrieren() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fehler, setFehler] = useState(null)
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setFehler(null)
        

        try {
            const res = await fetch("http://localhost:3000/api/auth/registrieren", {
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
            console.error(error)
            setFehler("Registrierung fehlgeschlagen. Bitte versuche es später erneut.")
        }
    }

    return (
        <main className="auth-page">
            <h1>Registrieren</h1>

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
                    minLength={8}
                />

                {fehler && (
                    <p role="alert" className="auth-error">
                        {fehler}
                    </p>
                )}

                <button type="submit">Registrieren</button>
            </form>

            <p>
                Schon ein Konto? <Link to="/login">Jetzt anmelden</Link>
            </p>
        </main>
    )
}

export default Registrieren