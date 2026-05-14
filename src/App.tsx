import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<div>Detta är en placeholder. Gå till <a href="/login" className="text-blue-500 hover:underline">Inloggning</a></div>} />
        </Routes>
    );
}

export default App