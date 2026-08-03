import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Login.css'
import { apiFetch } from '../services/api.js'

function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState(null)
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        

        try {
            const data = await apiFetch("/auth/registrieren", {
                method: "POST",
                body: JSON.stringify({ email, password, username })
            })

            login(data.token, data.email, data.username)
            navigate("/")
        } catch (error) {
            console.error(error)
            setError("Registrierung fehlgeschlagen. Bitte versuche es später erneut.")
        }
    }

    return (
        <main className="auth-page">
            <h2>Registrieren</h2>

            <form onSubmit={handleSubmit} className="auth-formular">
                <div className="auth-input">
                    <label htmlFor="email">E-Mail</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="auth-input">
                    <label htmlFor="username">Nutzername</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                
                <div className="auth-input">
                    <label htmlFor="password">Passwort</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>

                {error && (
                    <p role="alert" className="auth-error">
                        {error}
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

export default Register