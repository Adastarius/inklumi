const API_URL = "http://localhost:3000/api"

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token")

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
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