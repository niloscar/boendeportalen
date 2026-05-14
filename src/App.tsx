import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/:slug?" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}