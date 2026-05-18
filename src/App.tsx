import { Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import { signOut } from './lib/supabase'
import useAuth from './hooks/useAuth'

function App() {
    const { user } = useAuth()

    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<div>Detta är en placeholder. Gå till <a href="/auth" className="text-blue-500 hover:underline">Inloggning</a>
                {user && <div className="mt-4">
                    <div className="text-green-600">Inloggad som {user?.email}</div>
                    <button onClick={async () => { await signOut(); window.location.reload(); }} className="py-2 px-4 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700">Logga ut</button>
                </div>
                }
            </div>} />

        </Routes>
    );
}

export default App