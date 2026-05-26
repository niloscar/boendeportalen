import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, type ReactNode } from 'react'

import { AdminRouteWrapper, PrivateRouteWrapper, PublicOnlyRouteWrapper, RouteLoadingFallback } from './routing/Routing'

// Import pages here
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'

const AuthPage = lazy(() => import('./pages/Auth'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const SearchApartmentPage = lazy(() => import('./pages/SearchApartment'))
const ApartmentPage = lazy(() => import('./pages/Apartment'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const Parking = lazy(() => import('./pages/Parking'))
const LaundryPage = lazy(() => import('./pages/Laundry'))
const GuestSuitePage = lazy(() => import('./pages/GuestSuite'))

function LazyRoute({ children }: { children: ReactNode }) {
    return <Suspense fallback={<RouteLoadingFallback />}>{children}</Suspense>
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
                    <Route path="/parking" element={<LazyRoute><Parking /></LazyRoute>} />
                    <Route path="/parking/:parkingId" element={<div>Detaljsida för parkeringsplats (under utveckling)</div>} />
                    <Route path="/admin/*" element={<AdminRouteWrapper><LazyRoute><AdminPage /></LazyRoute></AdminRouteWrapper>} />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App