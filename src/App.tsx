import { Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import useAuth from './hooks/useAuth'

// Import route guards here, like PrivateRoute and AdminRoute, if you want to use them in this file.
import { PublicOnlyRoute, AdminRoute } from './routing'

// Import pages here
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import SearchApartment from "./pages/SearchApartment";
import Apartment from "./pages/Apartment";

function App() {
    // Add profile in here if you want to send profile info to route guards, like AdminRoute.
    const { user, loading, profile } = useAuth()

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex justify-center items-start">
                <Routes>
                    <Route path="/auth" element={<PublicOnlyRoute user={user} loading={loading}><Auth /></PublicOnlyRoute>} />
                    <Route path="/apartment" element={<SearchApartment />} />
                    <Route path="/apartment/:apartmentId" element={<Apartment />} />
                    {/* <Route path="/minasidor" element={<PrivateRoute user={user} loading={loading}><div>Detta är en privat sida.</div></PrivateRoute>} /> */}
                    <Route 
                        path="/admin/*" 
                        element={
                            <AdminRoute user={user} loading={loading} profile={profile}>
                                <AdminPage />
                            </AdminRoute>
                        } 
                    />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App