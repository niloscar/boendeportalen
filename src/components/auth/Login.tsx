import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithProvider } from '../../lib/supabase'
import { signInWithEmail } from '../../lib/supabase'
import type { LoginProps } from '../../types/auth'

function Login({ onSwitchToRegister, onForgotPassword }: LoginProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getErrorMessage = (e: unknown) => {
        if (!e) return ''
        if (e instanceof Error) return e.message
        if (typeof e === 'object' && e !== null && 'message' in e) {
            const maybe = (e as Record<string, unknown>).message
            if (typeof maybe === 'string') return maybe
        }
        try {
            return String(e)
        } catch {
            return 'Ett okänt fel uppstod'
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const { error } = await signInWithEmail(email, password)
            if (error) {
                setError(getErrorMessage(error))
            } else {
                navigate('/')
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='Ange emailadress'
                        className="w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-sm sm:text-base bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Lösenord:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='Ange lösenord'
                        className="w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-sm sm:text-base bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <button type="button" onClick={() => onForgotPassword?.()} className="text-sm text-green-500 cursor-pointer hover:underline self-end">Glömt lösenord?</button>
                <button type="submit" disabled={loading} className="w-full py-4 sm:py-5 md:py-6 text-sm sm:text-base bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition duration-200 disabled:opacity-60">{loading ? 'Loggar in…' : 'Logga in'}</button>

                {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                <p className="text-center text-sm sm:text-base text-gray-500">
                    Har du inget konto?
                    <button type="button" className="ml-1 text-green-500 cursor-pointer hover:underline" onClick={onSwitchToRegister}>
                        Registrera dig här
                    </button>
                </p>

                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-300/60" />
                    <span className="text-center text-gray-500 text-sm">Eller logga in med</span>
                    <div className="flex-1 h-px bg-gray-300/60" />
                </div>
                <div className="flex items-center justify-center gap-4">
                    <button type="button" className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 text-sm sm:text-base bg-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-300 transition duration-200" onClick={() => signInWithProvider('google')}>
                        <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                        Google
                    </button>
                </div>
            </form>
        </>
    )
}

export default Login