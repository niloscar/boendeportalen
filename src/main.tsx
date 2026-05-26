import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { FeaturesProvider } from './contexts/FeaturesProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <FeaturesProvider>
                    <App />
                </FeaturesProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)