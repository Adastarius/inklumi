import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { apiFetch } from '../services/api.js'
import './Login.css'
import { supabase } from '../services/supabase.js'

//Benutzerseite mit Profilinformationen
function User() {
    const { email, username, setUsername, loading } = useAuth()

    //Werte für die Eingabefelder
    const [emailInput, setEmailInput] = useState(email)
    const [usernameInput, setUsernameInput] = useState(username)

    const [profileError, setProfileError] = useState(null)
    const [profileStatus, setProfileStatus] = useState("idle") // idle | speichern | fertig

    const [newPassword, setNewPassword] = useState("")
    const [passwordError, setPasswordError] = useState(null)
    const [passwordStatus, setPasswordStatus] = useState("idle")

    //Speichern von Email und Username als Input für Eingabefelder
    useEffect(() => {
        if (email) setEmailInput(email)
    }, [email])

    useEffect(() => {
        if (username) setUsernameInput(username)
    }, [username])

    async function handleProfileSubmit(e) {
        e.preventDefault()
        setProfileError(null)
        setProfileStatus("speichern")

        try {
            if (emailInput !== email) {
                const { error } = await supabase.auth.updateUser({ email: emailInput })
                if (error) throw error
            }

            if (usernameInput !== username) {
                //speichert den Nutzernamen in der Datenbank
                const updated = await apiFetch("/auth/me", {
                    method: "PATCH",
                    body: JSON.stringify({ username: usernameInput })
                })
                //speichert den Nutzernamen im React-Kontext, damit er sofort angezeigt wird
                setUsername(updated.username)
            }

            setProfileStatus("fertig")
        } catch (error) {
            setProfileError(error.message || "Profil konnte nicht aktualisiert werden.")
            setProfileStatus("idle")
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault()
        setPasswordError(null)
        setPasswordStatus("speichern")

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) throw error

            setNewPassword("")
            setPasswordStatus("fertig")
        } catch (error) {
            setPasswordError(error.message || "Passwort konnte nicht geändert werden.")
            setPasswordStatus("idle")
        }
    }

    if (loading) {
        return (
            <main className="user-page"><p>Lädt...</p></main>
        )
    }

    return (
        <main className="user-page">
            <h2 className="user-greeting">Hallo {username}!</h2>

            <form onSubmit={handleProfileSubmit} className="profile-form">
                <h3>Profildaten</h3>
                <div className="auth-input">
                    <label htmlFor="email">E-Mail</label>
                    <input
                        id="email"
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                    />

                    <label htmlFor="username">Nutzername</label>
                    <input
                        id="username"
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        required
                    />
                </div>
                
                {profileError && (
                    <p role="alert" className="auth-error">{profileError}</p>
                )}
                {profileStatus === "fertig" && (
                    <p role="status">Profil wurde aktualisiert.</p>
                )}

                <button type="submit" disabled={profileStatus === "speichern"}>
                    {profileStatus === "speichern" ? "Wird gesendet..." : "Profil speichern"}
                </button>
            </form>
            
            <form onSubmit={handlePasswordSubmit} className="password-form">
                <h3>Passwort ändern</h3>
                <div className="auth-input">
                    <label htmlFor="newPassword">Neues Passwort</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>

                {passwordError && (
                    <p role="alert" className="auth-error">{passwordError}</p>
                )}
                {passwordStatus === "fertig" && (
                    <p role="status">Passwort wurde geändert.</p>
                )}

                <button type="submit" disabled={passwordStatus === "speichern"}>
                    {passwordStatus === "speichern" ? "Wird gesendet..." : "Passwort speichern"}
                </button>
            </form>
        </main>
    )
}

export default User