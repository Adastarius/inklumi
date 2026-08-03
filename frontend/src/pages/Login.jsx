import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'
import { apiFetch } from '../services/api.js'

function Login() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        try {
            const data = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ identifier, password })
            })

            login(data.token, data.email, data.username)
            navigate("/")
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <main className="auth-page">
            <h2>Anmelden</h2>

            <form onSubmit={handleSubmit} className="auth-formular">
                <div className="auth-input">
                    <label htmlFor="identifier">E-Mail/Nutzername</label>
                    <input
                        id="identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        autoComplete="username"
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
                    />
                </div>
                    
                {error && (
                    <p role="alert" className="auth-error">
                        {error}
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