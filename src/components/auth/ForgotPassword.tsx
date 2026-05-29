import { useState } from 'react'
import { resetPasswordForEmail } from '../../lib/supabase'
import type { Props } from '../../types/auth'

export default function ForgotPassword({ onClose }: Props) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setLoading(true)
        try {
            const { error } = await resetPasswordForEmail(email)
            if (error) {
                setError(error.message ?? 'Kunde inte skicka återställningslänk')
            } else {
                setMessage('Om en användare med den e-postadressen finns skickades en återställningslänk.')
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4'>
            <div className='absolute inset-0 bg-black/40' onClick={onClose} />
            <div className='relative w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-8 bg-white rounded-t-2xl sm:rounded-2xl shadow'>
                <h3 className='text-xl sm:text-2xl font-extrabold text-neutral-900 mb-2'>Återställ lösenord</h3>
                <p className='text-sm sm:text-base text-gray-700 mb-2'>Ange din e-postadress så skickar vi en länk för att återställa ditt lösenord.</p>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='forgot-email' className='text-sm font-medium text-gray-700'>Email:</label>
                        <input
                            id='forgot-email'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder='johan.andersson@example.com'
                            className='w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-base bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500'
                        />
                    </div>

                    <button type='submit' disabled={loading} className='w-full py-4 sm:py-5 md:py-6 text-sm sm:text-base bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition disabled:opacity-60'>
                        {loading ? 'Skickar…' : 'Skicka återställningslänk'}
                    </button>

                    <div className='text-center'>
                        <button type='button' onClick={onClose} className='text-sm text-green-500 cursor-pointer hover:underline'>Avbryt</button>
                    </div>

                    {message && <div className='text-green-600 text-sm text-center'>{message}</div>}
                    {error && <div className='text-red-600 text-sm text-center'>{error}</div>}
                </form>
            </div>
        </div>
    )
}
