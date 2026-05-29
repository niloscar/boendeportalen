import { Routes, Route, useLocation } from 'react-router-dom'
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
const ParkingDetails = lazy(() => import('./pages/ParkingDetails'))
const LaundryRoomPage = lazy(() => import('./pages/LaundryRoom'))
const GuestSuitePage = lazy(() => import('./pages/GuestSuite'))

function LazyRoute({ children }: { children: ReactNode }) {
    return <Suspense fallback={<RouteLoadingFallback />}>{children}</Suspense>
}

function App() {
    const location = useLocation()
    const isAuthPage = location.pathname === '/inloggning'

    return (
        <div className="min-h-screen flex flex-col">
            {!isAuthPage ? <Header /> : null}
            <main className={isAuthPage ? 'flex-1 flex w-full min-h-0' : 'flex-1 flex py-10 w-full max-w-6xl mx-auto px-4'}>
                <Routes>
                    <Route path="/inloggning" element={<PublicOnlyRouteWrapper><LazyRoute><AuthPage /></LazyRoute></PublicOnlyRouteWrapper>} />
                    <Route path="/minasidor" element={<PrivateRouteWrapper><LazyRoute><ProfilePage /></LazyRoute></PrivateRouteWrapper>} />
                    <Route path="/tvattstuga" element={<PrivateRouteWrapper><LazyRoute><LaundryRoomPage /></LazyRoute></PrivateRouteWrapper>} />
                    <Route path="/gastlagenhet" element={<PrivateRouteWrapper><LazyRoute><GuestSuitePage /></LazyRoute></PrivateRouteWrapper>} />
                    <Route path="/bostader" element={<LazyRoute><SearchApartmentPage /></LazyRoute>} />
                    <Route path="/bostader/:apartmentId" element={<LazyRoute><ApartmentPage /></LazyRoute>} />
                    <Route path="/parkeringar" element={<LazyRoute><Parking /></LazyRoute>} />
                    <Route path="/parkeringar/:parkingId" element={<LazyRoute><ParkingDetails /></LazyRoute>} />
                    <Route path="/admin/*" element={<AdminRouteWrapper><LazyRoute><AdminPage /></LazyRoute></AdminRouteWrapper>} />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </main>
            {!isAuthPage ? <Footer /> : null}
        </div>
    )
}

export default App