import { useEffect, useState } from 'react'
import { signUpWithEmail, supabase } from '../../lib/supabase'
import type { RegisterProps } from '../../types/auth'

function Register({ onSwitchToLogin }: RegisterProps) {
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phone, setPhone] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [cooldownSeconds, setCooldownSeconds] = useState(0)

    useEffect(() => {
        if (cooldownSeconds <= 0) return
        const id = window.setInterval(() => {
            setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => window.clearInterval(id)
    }, [cooldownSeconds])

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
        setSuccess(null)
        const trimmedFullName = fullName.trim()
        const trimmedPhone = phone.trim()
        const trimmedEmail = email.trim().toLowerCase()

        // Validation upon registration. Checks for valid full name, phone number, email format, password strength and match, and cooldown for rate limiting. Sets error messages accordingly.
        const fullNameRegex = /^[A-Za-zA-Za-z\u00C0-\u017F\s'-]{2,100}$/
        const phoneRegex = /^\+?[0-9\s-]{7,15}$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const hasDigit = /\d/.test(password)

        if (!fullNameRegex.test(trimmedFullName)) {
            setError('Ange ett giltigt fullständigt namn (minst 2 tecken).')
            return
        }

        if (!phoneRegex.test(trimmedPhone)) {
            setError('Ange ett giltigt telefonnummer (7-15 siffror, + tillåtet).')
            return
        }

        if (!emailRegex.test(trimmedEmail)) {
            setError('Ogiltig e-postadress')
            return
        }

        if (password.length < 8 || !hasDigit) {
            setError('Lösenordet måste vara minst 8 tecken och innehålla minst en siffra.')
            return
        }

        if (password !== confirmPassword) {
            setError('Lösenorden matchar inte')
            return
        }

        if (cooldownSeconds > 0) {
            setError(`För många försök. Vänta ${cooldownSeconds} sekunder och försök igen.`)
            return
        }

        setLoading(true)

        try {
            const { data, error } = await signUpWithEmail(trimmedEmail, password)
            if (error) {
                const msg = getErrorMessage(error)
                const lower = msg.toLowerCase()
                if (lower.includes('already') || lower.includes('duplicate') || lower.includes('exists') || lower.includes('already registered') || lower.includes('user already')) {
                    setError('Det finns redan ett konto med den e-postadressen. Logga in eller återställ lösenord.')
                } else if (lower.includes('rate limit') || lower.includes('email rate limit exceeded') || lower.includes('too many requests')) {
                    setCooldownSeconds(60)
                    setError('För många registreringsförsök just nu. Vänta 60 sekunder och försök igen.')
                } else {
                    setError(msg)
                }
            } else {
                const userId = data.user?.id

                if (userId) {
                    const { error: upsertError } = await supabase.from('users').upsert([
                        {
                            id: userId,
                            email: trimmedEmail,
                            full_name: trimmedFullName,
                            phone: trimmedPhone,
                            avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Default_pfp.jpg/250px-Default_pfp.jpg'
                        },
                    ])

                    // We upsert a profile row after signup. If this fails the user account may still exist in supabase auth users, but the profile data won't be saved. We then show a success or error message accordingly.
                    if (upsertError) {
                        setError('Registrering lyckades, men kunde inte uppdatera användarprofil. Kontakta support.')
                        console.error('Profile upsert error', upsertError)
                    } else {
                        setSuccess('Registrering lyckades! Kontrollera din email för att bekräfta ditt konto.')
                    }
                } else {
                    // User id not returned; fall back to success message
                    setSuccess('Registrering lyckades! Kontrollera din email för att bekräfta ditt konto.')
                }
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
                    <label htmlFor="full-name" className="text-sm font-medium text-gray-700">Fullt namn:</label>
                    <input
                        type="text"
                        id="full-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder='Johan Andersson'
                        className="w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-base bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Telefon:</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder='0701234567'
                        className="w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-base bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="register-email" className="text-sm font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        id="register-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='johan.andersson@example.com'
                        className="w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-base bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="register-password" className="text-sm font-medium text-gray-700">Lösenord:</label>
                    <input
                        type="password"
                        id="register-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='********'
                        className="w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-base bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Bekräfta lösenord:</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder='********'
                        className="w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-sm sm:text-base bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <button type="submit" disabled={loading || cooldownSeconds > 0} className="w-full py-4 sm:py-5 md:py-6 text-sm sm:text-base bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition duration-200 disabled:opacity-60">
                    {loading ? 'Skapar konto…' : cooldownSeconds > 0 ? `Vänta ${cooldownSeconds}s` : 'Skapa konto'}
                </button>

                {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                {success && <div className="text-green-600 text-sm text-center">{success}</div>}

                <p className="text-center text-sm sm:text-base text-gray-500">
                    Har du redan ett konto?
                    <button type="button" className="ml-1 text-green-500 cursor-pointer hover:underline" onClick={onSwitchToLogin}>Logga in här</button>
                </p>
            </form>
        </>
    )
}

export default Register