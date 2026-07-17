import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [email, setEmail] = useState(localStorage.getItem("email"))

    function login(newToken, newEmail) {
        localStorage.setItem("token", newToken)
        localStorage.setItem("email", newEmail)
        setToken(newToken)
        setEmail(newEmail)
    }

    function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("email")
        setToken(null)
        setEmail(null)
    }

    return (
        <AuthContext.Provider value={{ token, email, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}