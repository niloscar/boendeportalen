import SearchApartment from "./pages/SearchApartment.tsx";

export default function App() {
    return (
        <div id="app" className='min-h-screen flex items-center justify-center'>
            <h1 className='text-4xl font-bold'>
                Hello world!
            </h1>
            <SearchApartment />
        </div>
    );
}