import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { apiFetch } from '../services/api.js'
import './Login.css'

function User() {
    const { token, email, username, login } = useAuth()
    const [emailInput, setEmailInput] = useState(email)
    const [usernameInput, setUsernameInput] = useState(username)
    const [profileError, setProfileError] = useState(null)
    const [profileStatus, setProfileStatus] = useState("idle") // idle | speichern | fertig

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [passwordError, setPasswordError] = useState(null)
    const [passwordStatus, setPasswordStatus] = useState("idle")

    async function handleProfileSubmit(e) {
        e.preventDefault()
        setProfileError(null)
        setProfileStatus("speichern")

        try {
            const updated = await apiFetch("/auth/me", {
                method: "PATCH",
                body: JSON.stringify({ email: emailInput, username: usernameInput})
            })

            login(token, updated.email, updated.username)
            setProfileStatus("fertig")
        } catch (error) {
            setProfileError(error.mesage)
            setProfileStatus("idle")
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault()
        setPasswordError(null)
        setPasswordStatus("speichern")

        try {
            await apiFetch("/auth/me/password", {
                method: "PATCH",
                body: JSON.stringify({ currentPassword, newPassword })
            })

            setCurrentPassword("")
            setNewPassword("")
            setPasswordStatus("fertig")
        } catch (error) {
            setPasswordError(error.message)
            setPasswordStatus("idle")
        }
    }

    return (
        <main className="user-page">
            <h2 className="user-greeting">Hallo {username}</h2>

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
                    <label htmlFor="current-password">Aktuelles Passwort</label>
                    <input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />

                    <label htmlFor="new-password">Neues Passwort</label>
                    <input
                        id="new-password"
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