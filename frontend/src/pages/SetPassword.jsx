import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase.js'

function SetPassword() {
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        const { error } = await supabase.auth.updateUser({ password })
        if (error) {
            setError("Passwort konnte nicht gespeichert werden.")
            return
        }

        setSuccess(true)
        //Timer um anzzuzeigen, dass das Passwort erfolgreich gespeichert wurde
        setTimeout(() => navigate("/"), 1500)
    }

    return (
        <main className="auth-page">
            <h2>Passwort festlegen</h2>

            {success ? (
                <p>Passwort gespeichert! Du wirst weitergeleitet...</p>
            ) : (
                <form onSubmit={handleSubmit} className="auth-formular">
                    <div className="auth-input">
                        <label htmlFor="password">Neues Passwort</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    {error && <p role="alert" className="auth-error">{error}</p>}

                    <button type="submit">Passwort speichern</button>
                </form>
            )}
        </main>
    )
}

export default SetPassword