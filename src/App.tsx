import { Link, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import { signOut } from './lib/supabase'
import useAuth from './hooks/useAuth'

// Import route guards here, like PrivateRoute and AdminRoute, if you want to use them in this file.
import { PublicOnlyRoute, AdminRoute } from './routing'

// Import pages here
import AdminPage from './pages/AdminPage'

function App() {
    // Add profile in here if you want to send profile info to route guards, like AdminRoute.
    const { user, loading, profile } = useAuth()
    const isAdmin = profile?.role === 'admin'

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
            <Route path="/" element={
                <div className="max-w-2xl mx-auto my-10 p-4 flex flex-col gap-2 text-neutral-500">
                    <p className="font-bold text-neutral-900">Det här är en placeholder för startsidan.</p>
                    {!user && <p><Link to="/auth" className="text-neutral-900 hover:underline">Logga in</Link> för att se mer.</p>}
                    {user && <div className="mt-4 flex flex-col gap-2">
                        <p>Inloggad som <Link to="/profile" className="text-neutral-900 hover:underline">{profile?.full_name}</Link>.</p>
                        {isAdmin && <p>Du har adminbehörighet. Gå till <Link to="/admin" className="text-neutral-900 hover:underline">adminsidan</Link>.</p>}
                        <button onClick={async () => { await signOut(); window.location.reload(); }} className="py-2 px-4 mr-auto bg-red-600 text-white rounded cursor-pointer hover:bg-red-700">Logga ut</button>
                    </div>
                    }
                </div>
            } />
        </Routes>
    );
}

export default App