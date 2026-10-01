import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext.jsx'

const { getSession, onAuthStateChange, apiFetch, signInWithPassword, signOut } = vi.hoisted(() => ({
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    apiFetch: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
}))

vi.mock('../services/supabase.js', () => ({
    supabase: {
        auth: { getSession, onAuthStateChange, signInWithPassword, signOut },
    },
}))

vi.mock('../services/api.js', () => ({ apiFetch }))

function AuthConsumer() {
    const { loading, token, email, username, loginWithPassword, logout } = useAuth()

    return (
        <div>
            <output data-testid="loading">{String(loading)}</output>
            <output data-testid="token">{token ?? ''}</output>
            <output data-testid="email">{email ?? ''}</output>
            <output data-testid="username">{username ?? ''}</output>
            <button onClick={() => loginWithPassword('ada@example.com', 'secret')}>login</button>
            <button onClick={logout}>logout</button>
        </div>
    )
}

describe('AuthProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        getSession.mockResolvedValue({ data: { session: null } })
        onAuthStateChange.mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
        })
        signInWithPassword.mockResolvedValue({ error: null })
        signOut.mockResolvedValue({ error: null })
    })

    it('exposes session details and loads the username', async () => {
        getSession.mockResolvedValue({
            data: {
                session: {
                    access_token: 'test-token',
                    user: { email: 'ada@example.com' },
                },
            },
        })
        apiFetch.mockResolvedValue({ username: 'Ada' })

        render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>,
        )

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false')
        })

        expect(screen.getByTestId('token')).toHaveTextContent('test-token')
        expect(screen.getByTestId('email')).toHaveTextContent('ada@example.com')
        expect(screen.getByTestId('username')).toHaveTextContent('Ada')
        expect(apiFetch).toHaveBeenCalledWith('/auth/me')
    })

    it('delegates login and logout to Supabase', async () => {
        const user = userEvent.setup()

        render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>,
        )

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false')
        })
        await user.click(screen.getByRole('button', { name: 'login' }))
        await user.click(screen.getByRole('button', { name: 'logout' }))

        expect(signInWithPassword).toHaveBeenCalledWith({
            email: 'ada@example.com',
            password: 'secret',
        })
        expect(signOut).toHaveBeenCalledOnce()
    })
})