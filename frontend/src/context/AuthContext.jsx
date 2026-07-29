import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [email, setEmail] = useState(localStorage.getItem("email"))
    const [username, setUsername] = useState(localStorage.getItem("username")) 

    function login(newToken, newEmail, newUsername) {
        localStorage.setItem("token", newToken)
        localStorage.setItem("email", newEmail)
        localStorage.setItem("username", newUsername)
        setToken(newToken)
        setEmail(newEmail)
        setUsername(newUsername)
    }

    function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("email")
        localStorage.removeItem("username")
        setToken(null)
        setEmail(null)
        setUsername(null)
    }

    return (
        <AuthContext.Provider value={{ token, email, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}