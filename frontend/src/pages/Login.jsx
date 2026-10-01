import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'
import { supabase } from '../services/supabase.js'

//Login Komponente (enthält auch Passwort vergessen)
function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const { loginWithPassword } = useAuth()
    const navigate = useNavigate()

    //Komponente rendert andere Elemente bei Login oder Passwort vergessen
    const [mode, setMode] = useState("login") // login | forgotPassword
    const [resetEmail, setResetEmail] = useState("")
    const [resetEmailSent, setResetEmailSent] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        try {
            await loginWithPassword(email, password)
            navigate("/")
        } catch (error) {
            setError("Anmeldung fehlgeschlagen. Bitte überprüfe deine Daten.")
        }
    }

    async function handleOAuthLogin(provider) {
        setError(null)
        try {
            await loginWithOAuth(provider)
        } catch (error) {
            setError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.")
        }
    }

    async function handleForgotPasswordSubmit(e) {
        e.preventDefault()
        setError(null)

        try {
            await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: "http://localhost:5173/passwort-setzen"     //Seite, die beim Klicken auf den Link aufgerufen wird
            })
            setResetEmailSent(true)
        } catch (error) {
            setError("Passwort zurücksetzen fehlgeschlagen. Bitte versuche es erneut.")
        }
    }

    //Passwort vergessen
    if (mode === "forgotPassword") {
        return (
            <main className="auth-page">
                <h2>Passwort vergessen</h2>

                {resetEmailSent ? (
                    <p>
                        Falls ein Konto mit dieser E-Mail existiert, haben wir dir einen Link zum Zurücksetzen geschickt.
                    </p>
                ) : (
                    <form onSubmit={handleForgotPasswordSubmit} className="auth-formular">
                        <div className="auth-input">
                            <label htmlFor="resetEmail">E-Mail</label>
                            <input
                                id="email"
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        {error && (
                            <p role="alert" className="auth-error">
                                {error}
                            </p>
                        )}

                        <button type="submit" className="-auth-send-button">Link zum Zurücksetzen senden</button>
                    </form>
                )}

                <p>
                    <button
                        type="button"
                        className="auth-link-button"
                        onClick={() => {
                            setMode("login")
                            setError(null)
                            setResetEmailSent(false)
                        }}
                    >
                        Zurück zur Anmeldung
                    </button>
                </p>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <h2>Anmelden</h2>

            <form onSubmit={handleSubmit} className="auth-formular">
                <div className="auth-input">
                    <label htmlFor="email">E-Mail</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
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
                        autoComplete="current-password"
                    />
                </div>
                    
                {error && (
                    <p role="alert" className="auth-error">
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => {
                        setMode("forgotPassword")
                        setResetEmail(email)
                        setError(null)
                    }}
                    className="forgot-password"
                >
                    Passwort vergessen?
                </button>

                <button type="submit">Anmelden</button>
            </form>

            {/*<div className="auth-divider">oder</div>

             <button type="button" onClick={() => handleOAuthLogin('google')}>
                Mit Google anmelden
            </button> */}

            <p>
                Noch kein Konto? <Link to="/registrieren">Jetzt registrieren</Link>
            </p>
        </main>
    )
}

export default Login