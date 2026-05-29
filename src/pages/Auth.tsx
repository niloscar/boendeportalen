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
        <div className='h-full min-h-0 w-full flex items-center justify-center py-4 sm:py-6 md:py-8'>
            <div className={`flex h-full min-h-0 w-full md:w-[95%] lg:w-[92%] xl:w-[88%] 2xl:w-3/4 overflow-hidden bg-neutral-400 md:rounded-2xl shadow-none md:shadow-md ${styles.cardTransition}`}>
                <div className='hidden lg:block lg:w-1/2 2xl:w-2/3 min-h-full bg-gradient-to-r from-green-700 to-green-500'>
                    <div className='relative h-full flex items-center justify-center'>
                        <img src='/city.svg' alt='City' className={styles.cityfloat + ' ' + styles.cityImage + ' opacity-90'} />
                        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-green-950/30 via-transparent to-white/10' />
                    </div>
                </div>

                <div className='w-full lg:w-1/2 2xl:w-1/3 min-h-0 flex bg-white items-stretch justify-center px-5 py-6 sm:px-8 sm:py-8 md:px-8 md:py-8 lg:px-8 lg:py-8 xl:px-10 xl:py-10 2xl:px-12 2xl:py-12 overflow-hidden lg:overflow-hidden'>
                    <div className='w-full min-h-0 flex flex-col gap-4 sm:gap-6 md:gap-5 lg:gap-6 overflow-hidden'>
                        <div className='flex flex-row items-start sm:items-center flex-wrap justify-between gap-1'>
                            <h2 className='text-2xl sm:text-3xl xl:text-3xl 2xl:text-4xl text-neutral-900 font-extrabold leading-tight'>Boende<span className='text-green-500'>Portalen</span></h2>
                            <div className='hidden lg:block text-right'>
                                <div className='text-gray-600 text-xs whitespace-nowrap'>{weekday} {formattedTime}</div>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center items-center px-2 sm:px-6 py-1 sm:py-2 gap-3 sm:gap-4'>
                            <h1 className='text-3xl sm:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-neutral-900 text-center leading-tight'>
                                {isLogin ? 'Välkommen!' : 'Registrera dig!'}
                            </h1>
                            <p className='text-sm sm:text-base text-gray-700 text-center max-w-prose'>
                                {isLogin ? 'Välkommen till BoendePortalen! Här kan du enkelt hantera din bostad.' : 'Skapa ett konto för att komma igång med BoendePortalen!'}
                            </p>
                        </div>

                        <div className={`${styles.formSwap} ${isSwitching ? styles.formSwapOut : styles.formSwapIn} overflow-hidden`}>
                            {isLogin ? (
                                <Login onSwitchToRegister={() => switchAuthMode(false)} onForgotPassword={() => setShowForgot(true)} />
                            ) : (
                                <Register onSwitchToLogin={() => switchAuthMode(true)} />
                            )}
                        </div>

                        {showForgot && <ForgotPassword onClose={() => setShowForgot(false)} />}
                        {showReset && <ResetPassword onClose={() => setShowReset(false)} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth