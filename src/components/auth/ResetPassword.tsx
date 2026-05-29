import { useEffect, useState } from 'react'
import { handleSessionFromUrl, signOut, updateUser } from '../../lib/supabase'
import type { Props } from '../../types/auth'

export default function ResetPassword({ onClose }: Props) {
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function checkForSession() {
            try {
                await handleSessionFromUrl()
            } catch {
                // ignore
            }
        }
        checkForSession()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setMessage(null)
        if (password.length < 8) return setError('Lösenordet måste vara minst 8 tecken')
        if (password !== confirm) return setError('Lösenorden matchar inte')
        setLoading(true)
        try {
            const { error: upErr } = await updateUser({ password })
            if (upErr) {
                setError(upErr.message ?? 'Kunde inte uppdatera lösenord')
            } else {
                await signOut()
                window.history.replaceState({}, '', '/auth')
                setMessage('Lösenordet uppdaterades. Nu kan du logga in med ditt nya lösenord.')
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='reset-password' className='text-sm font-medium text-gray-700'>Nytt lösenord</label>
                        <input id='reset-password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Nytt lösenord' className='w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-base bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='reset-confirm' className='text-sm font-medium text-gray-700'>Bekräfta lösenord</label>
                        <input id='reset-confirm' type='password' value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder='Bekräfta lösenord' className='w-full px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 text-base bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500' />
                    </div>

                    <button type='submit' disabled={loading} className='w-full py-4 sm:py-5 md:py-6 text-sm sm:text-base bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition disabled:opacity-60'>
                        {loading ? 'Sparar…' : 'Spara nytt lösenord'}
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
