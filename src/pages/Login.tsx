import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

// This entire page is made without any global divs or components. So we might have to add the first div to the App.tsx file later or something.

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // I can probably put this inside a hook/component later on, but for now this is fine
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Handle login logic here
        console.log('Email:', email)
        console.log('Password:', password)
    }

    return (
        <div className='h-screen flex bg-neutral-200 items-center justify-center'>
            <div className='flex h-3/4 w-3/4 rounded-l-2xl'>
                <div className='w-2/3 h-full bg-gradient-to-r from-green-700 to-green-500 rounded-l-2xl'>
                    <div className='relative h-full overflow-hidden rounded-l-2xl'>
                        <img src='/city.svg' alt='City' className={styles.cityfloat + ' w-full h-full object-cover opacity-80'} />
                        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-green-950/30 via-transparent to-white/10' />
                    </div>
                </div>
                <div className='w-1/3 h-full flex bg-white items-center rounded-r-2xl justify-center p-16'>
                    <div className='w-full h-full flex flex-col gap-8'>
                        {/* Header */}
                        <div className="flex flex-row items-center justify-between">
                            <h2 className='text-4xl text-neutral-900 font-extrabold'>Bostads<span className='text-green-500'>Portalen</span></h2>
                            <p className='text-gray-600 ml-2'>Gjord 04:30 en <strong>Onsdag</strong>.</p>
                        </div>

                        {/* Welcome Message & Description */}
                        <div className="flex flex-col justify-center items-center px-8 py-4 gap-8">
                            <h1 className='text-5xl font-bold text-neutral-900'>Välkommen!</h1>
                            <p className='text-md text-gray-700 text-center'>Välkommen till BostadsHjälpen! Här kan du enkelt hantera din bostad och få hjälp med vardagliga uppgifter.</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder='Ange emailadress'
                                    className="w-full p-6 bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full p-6 bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <Link to="/forgot-password" className="text-sm text-green-500 hover:underline self-end">Glömt lösenord?</Link>
                            <button type="submit" className="w-full py-6 bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition duration-200">Logga in</button>

                            {/* Login with Social Media */}
                            {/* Keep in mind, these are just placeholder and need to be implemented or deleted */}
                            <p className="text-center text-gray-500">Eller logga in med</p>
                            <div className="flex items-center justify-center gap-4">
                                <button className="flex items-center gap-2 px-4 py-3 bg-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-300 transition duration-200">
                                    <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                                    Google
                                </button>
                                <button className="flex items-center gap-2 px-4 py-3 bg-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-300 transition duration-200">
                                    <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
                                    Facebook
                                </button>
                                <button className="flex items-center gap-2 px-4 py-3 bg-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-300 transition duration-200">
                                    <img src="/linkedin-icon.svg" alt="LinkedIn" className="w-5 h-5" />
                                    LinkedIn
                                </button>
                                <button className="flex items-center gap-2 px-4 py-3 bg-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-300 transition duration-200">
                                    <img src="/bankid-icon.svg" alt="BankID" className="w-5 h-5" />
                                    BankID
                                </button>
                            </div>
                            {/* Helpcenter text */}
                            {/* Might want to change this to a link to register or something? */}
                            <p className="text-center text-gray-500">
                                Har du inget konto? <Link to="/register" className="text-green-500 hover:underline">Registrera dig här</Link>
                            </p>
                        </form>

                        {/* Footer */}
                        <div className="mt-auto text-center">
                            <p className='text-gray-500'>© 2026 <strong>BostadsPortalen</strong>. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login