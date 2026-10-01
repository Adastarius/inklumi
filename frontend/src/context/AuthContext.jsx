import { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../services/supabase.js'
import { apiFetch } from '../services/api.js'

//Erstellen eines Kontexts, um Authentifizierungsdaten für alle Komponenten verfügbar zu machen
const AuthContext = createContext()

//stellt den Context bereit im return()
export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)

    //Session von Supabase abrufen (Session enthält User-ID, E-Mail und Token)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
            if (session) loadProfile()
        })

        //Änderungen werden überwacht, subscription wird von Supabase zurückgegeben (ein Listener beim Auth-System)
        //_event ist der Name der Änderung, z.B. SIGNED_IN
        //die callback-Funktion wird bei jeder Änderung ausgeführt
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                if (session) {
                    loadProfile()
                } else {
                    setUsername(null)
                }
            }
        )
        //Entfernen des Listeners
        return () => subscription.unsubscribe()
    }, [])

    async function loginWithPassword(email, password) {
        const { error } = await supabase.auth.signInWithPassword( { email, password })
        if (error) throw error
    }

    //Login mit einem OAuth-Provider, z.B. Google
    async function loginWithOAuth(provider) {
        const { error } = await supabase.auth.signInWithOAuth({ provider })
        if (error) throw error
    }

    async function register(email, password, username) {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } }
        })
        if (error) throw error
    }

    async function logout() {
        await supabase.auth.signOut()
    }

    //Benutzername laden
    async function loadProfile() {
        try {
            const profile = await apiFetch("/auth/me")
            setUsername(profile.username)
        } catch (error) {
            console.error("Profil konnte nicht geladen werden: ", error)
        }
    }

    //Variablen und Funktionen die für andere Komponenten bereitgestellt werden sollen
    const value = {
        session,
        token: session?.access_token ?? null,
        email: session?.user?.email ?? null,
        username,
        loading,
        loginWithPassword,
        loginWithOAuth,
        register,
        logout,
        setUsername
    }

    //AuthContext.Provider ist der React-Mechanismus, der die Werte im Context bereitstellt
    return (
        <AuthContext.Provider value={ value }>
            {children}
        </AuthContext.Provider>
    )
}

//Mit der useAuth()-Hook können andere Komponenten die Variablen und Funktionen nutzen
export function useAuth() {
    return useContext(AuthContext)
}