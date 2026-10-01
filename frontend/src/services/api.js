import { supabase } from './supabase.js'

//URL für Anfragen an das Backend
const API_URL = "http://localhost:3000/api"

//Funktion für API-Anfragen und Wiederverwendung im Code
export async function apiFetch(path, options = {}) {
    const { data: { session } } = await supabase.auth.getSession()

    //Hinzufügen des Tokens falls vorhanden zum header
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` })
    }

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    })

    //Bei 204 gibt es keinen Body zum parsen, z.B. bei DELETE würde Exception geworfen werden
    if (res.status === 204) {
        return null
    }

    const data = await res.json()

    if(!res.ok) {
        throw new Error(data.error)
    }

    return data
}