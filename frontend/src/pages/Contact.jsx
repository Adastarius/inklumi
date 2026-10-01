import { useState } from 'react'
import './Contact.css'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../services/api.js'

function Contact() {
    const [topic, setTopic] = useState("")
    const [message, setMessage] = useState("")
    const [isSent, setIsSent] = useState(false)

    //E-Mail mit useAuth() abbrufen und als userEmail speichern
    const { email:userEmail } = useAuth()
    const [email, setEmail] = useState(userEmail ?? "")
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        setIsSent(true)

        try {
            await apiFetch("/contact", {
                method: "POST",
                body: JSON.stringify({ email, topic, message })
            })

            setTopic("")
            setMessage("")
            setSuccess(true)
        } catch (error) {
            setError(error.message || "Nachricht konnte nicht gesendet werden.")
            console.error(error)
        } finally {
            setIsSent(false)
        }
    }
    return (
        <main className="contact-page">
            <div className="contact-card">
                <h1>Kontaktformular</h1>
                <h2>Bei Fragen, Anregungen oder Problemen schreib uns gerne eine Nachricht!</h2>
                <form onSubmit={handleSubmit} className="contact-formular">
                    <label htmlFor="email-contact">E-Mail</label>
                    <input
                        id="email-contact"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="topic">Thema</label>
                    <input
                        id="topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                    />

                    <label htmlFor="message">Nachricht</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={7}
                        required
                    />

                    {error && (
                        <p role="alert" className="auth-error">{error}</p>
                    )}
                    {success && (
                        <p role="status">Deine Nachricht wurde gesendet. Danke!</p>
                    )}

                    <button type="submit" disabled={isSent}>
                        {isSent ? "Wird gesendet..." : "Abschicken"}
                    </button>
                </form>
            </div>
        </main>
    )
}

export default Contact