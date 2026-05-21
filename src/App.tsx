import { Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import { signOut } from './lib/supabase'
import useAuth from './hooks/useAuth'
// Import route guards here, like PrivateRoute and AdminRoute, if you want to use them in this file.
import { PublicOnlyRoute, AdminRoute } from './routing'
import AdminPage from './pages/AdminPage'

function App() {
    // Add profile in here if you want to send profile info to route guards, like AdminRoute.
    const { user, loading, profile } = useAuth()

    console.log('App component - user:', user)
    console.log('App component - profile:', profile)

    return (
        <Routes>
            <Route path="/auth" element={<PublicOnlyRoute user={user} loading={loading}><Auth /></PublicOnlyRoute>} />
            {/* <Route path="/minasidor" element={<PrivateRoute user={user} loading={loading}><div>Detta är en privat sida.</div></PrivateRoute>} /> */}
            <Route 
                path="/admin/*" 
                element={
                    <AdminRoute user={user} loading={loading} profile={profile}>
                        <AdminPage profile={profile} signOut={signOut} />
                    </AdminRoute>
                } 
            />
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