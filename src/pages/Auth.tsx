import { useState, useEffect } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import styles from './Auth.module.css';

const isRecoveryFlow = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    return (
        searchParams.get('type') === 'recovery' ||
        !!searchParams.get('access_token') ||
        !!searchParams.get('refresh_token') ||
        hashParams.get('type') === 'recovery' ||
        !!hashParams.get('access_token') ||
        !!hashParams.get('refresh_token')
    )
}

function Auth() {
    const [now, setNow] = useState<Date>(new Date())
    const [isLogin, setIsLogin] = useState(true)
    const [isSwitching, setIsSwitching] = useState(false)
    const [showForgot, setShowForgot] = useState(false)
    const [showReset, setShowReset] = useState(() => isRecoveryFlow())

    const switchAuthMode = (nextIsLogin: boolean) => {
        if (nextIsLogin === isLogin || isSwitching) return
        setIsSwitching(true)
        window.setTimeout(() => {
            setIsLogin(nextIsLogin)
            setIsSwitching(false)
        }, 180)
    }

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000)
        return () => clearInterval(id)
    }, [])

    const weekdays = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag']
    const pad = (n: number) => String(n).padStart(2, '0')
    const formattedTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`
    const weekday = weekdays[now.getDay()]

    return (
        <div className='min-h-screen flex bg-neutral-200 items-center justify-center p-8'>
            <div className={`flex w-3/4 h-full overflow-hidden rounded-2xl shadow-2xl ${styles.cardTransition}`}>
                <div className='w-2/3 min-h-full bg-gradient-to-r from-green-700 to-green-500'>
                    <div className='relative h-full flex items-center justify-center'>
                        <img src='/city.svg' alt='City' className={styles.cityfloat + ' ' + styles.cityImage + ' opacity-90'} />
                        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-green-950/30 via-transparent to-white/10' />
                    </div>
                </div>

                <div className='w-1/3 min-h-full flex bg-white items-stretch justify-center p-16 overflow-y-auto'>
                    <div className='w-full min-h-full flex flex-col gap-8'>
                        <div className='flex flex-row items-center justify-between'>
                            <h2 className='text-4xl text-neutral-900 font-extrabold'>Bostads<span className='text-green-500'>Portalen</span></h2>
                            <div className='ml-2 text-right'>
                                <div className='text-gray-600 text-sm'>{weekday} | {formattedTime}</div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center items-center px-8 py-4 gap-8'>
                            <h1 className='text-5xl font-bold text-neutral-900'>
                                {isLogin ? 'Välkommen!' : 'Registrera dig!'}
                            </h1>
                            <p className='text-md text-gray-700 text-center'>
                                {isLogin ? 'Välkommen till BostadsPortalen! Här kan du enkelt hantera din bostad och få hjälp med vardagliga uppgifter.' : 'Skapa ett konto för att komma igång med BostadsPortalen!'}
                            </p>
                        </div>

                        <div className={`${styles.formSwap} ${isSwitching ? styles.formSwapOut : styles.formSwapIn}`}>
                            {isLogin ? (
                                <Login onSwitchToRegister={() => switchAuthMode(false)} onForgotPassword={() => setShowForgot(true)} />
                            ) : (
                                <Register onSwitchToLogin={() => switchAuthMode(true)} />
                            )}
                        </div>

                        {showForgot && <ForgotPassword onClose={() => setShowForgot(false)} />}
                        {showReset && <ResetPassword onClose={() => setShowReset(false)} />}

                        <div className='mt-auto text-center'>
                            <p className='text-gray-500'>© 2026 <strong>BostadsPortalen</strong>. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth