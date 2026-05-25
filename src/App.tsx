import { Link, Routes, Route } from 'react-router-dom'
import type { ReactNode } from 'react'
import Auth from './pages/Auth'
import { signOut } from './lib/supabase'
import useAuth from './hooks/useAuth'

import { PublicOnlyRoute, AdminRoute } from './routing'

import AdminPage from './pages/AdminPage'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SearchApartment from './pages/SearchApartment'
import Apartment from './pages/Apartment'

function HomePage() {
    const { user } = useAuth()

    return (
        <div>
            Detta är en placeholder. Gå till <Link to="/auth" className="text-blue-500 hover:underline">Inloggning</Link>
            {user && <div className="mt-4">
                <div className="text-green-600">Inloggad som {user.email}</div>
                <button onClick={async () => { await signOut(); window.location.reload(); }} className="py-2 px-4 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700">Logga ut</button>
            </div>}
        </div>
    )
}

function PublicOnlyRouteWrapper({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth()

    return <PublicOnlyRoute user={user} loading={loading}>{children}</PublicOnlyRoute>
}

function AdminRouteWrapper({ children }: { children: ReactNode }) {
    const { user, loading, profile } = useAuth()

    return <AdminRoute user={user} loading={loading} profile={profile}>{children}</AdminRoute>
}

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex justify-center items-start">
                <Routes>
                    <Route path="/auth" element={<PublicOnlyRouteWrapper><Auth /></PublicOnlyRouteWrapper>} />
                    <Route path="/apartment" element={<SearchApartment />} />
                    <Route path="/apartment/:apartmentId" element={<Apartment />} />
                    <Route
                        path="/admin/*"
                        element={<AdminRouteWrapper><AdminPage /></AdminRouteWrapper>}
                    />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App