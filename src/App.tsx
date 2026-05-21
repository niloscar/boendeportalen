import { Routes, Route } from 'react-router-dom';
import SearchApartment from "./pages/SearchApartment";
import Apartment from "./pages/Apartment";

function App() {
    return (
        <div id="app" className='min-h-screen flex justify-center'>
                <Routes>
                    <Route path="/" element={<SearchApartment />} />
                    <Route path="/apartment/:apartmentId" element={<Apartment />} />
                </Routes>
        </div>
    );
}

export default App