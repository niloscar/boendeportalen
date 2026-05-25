import { Link, Routes, Route } from 'react-router-dom'
import { Suspense, lazy, type ReactNode } from 'react'
import { signOut } from './lib/supabase'
import useAuth from './hooks/useAuth'

import { PublicOnlyRoute, AdminRoute, PrivateRoute } from './routing'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

const AuthPage = lazy(() => import('./pages/Auth'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const SearchApartmentPage = lazy(() => import('./pages/SearchApartment'))
const ApartmentPage = lazy(() => import('./pages/Apartment'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const LaundryPage = lazy(() => import('./pages/Laundry'))
const GuestSuitePage = lazy(() => import('./pages/GuestSuite'))

function RouteFallback() {
    return (
        <div className="w-full max-w-6xl p-6 text-sm text-center text-gray-600">
            Laddar sida...
        </div>
    )
}

function LazyRoute({ children }: { children: ReactNode }) {
    return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

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

function PrivateRouteWrapper({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth()
    return <PrivateRoute user={user} loading={loading}>{children}</PrivateRoute>
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
                    <Route path="/auth" element={<PublicOnlyRouteWrapper><LazyRoute><AuthPage /></LazyRoute></PublicOnlyRouteWrapper>} />
                    <Route path="/minasidor" element={<PrivateRouteWrapper><LazyRoute><ProfilePage /></LazyRoute></PrivateRouteWrapper>} />
                    <Route path="/tvattid" element={<PrivateRouteWrapper><LazyRoute><LaundryPage /></LazyRoute></PrivateRouteWrapper>} />
                    <Route path="/gastlagenhet" element={<PrivateRouteWrapper><LazyRoute><GuestSuitePage /></LazyRoute></PrivateRouteWrapper>} />
                    <Route path="/apartment" element={<LazyRoute><SearchApartmentPage /></LazyRoute>} />
                    <Route path="/apartment/:apartmentId" element={<LazyRoute><ApartmentPage /></LazyRoute>} />
                    <Route
                        path="/admin/*"
                        element={<AdminRouteWrapper><LazyRoute><AdminPage /></LazyRoute></AdminRouteWrapper>}
                    />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App
