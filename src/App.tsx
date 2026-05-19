import { getAvailableApartments } from './api/apartmentApi.ts';

export default function App() {
    console.log(getAvailableApartments());
    return (
        <div id="app" className='min-h-screen flex items-center justify-center'>
            <h1 className='text-4xl font-bold'>
                Hello world!
            </h1>
        </div>
    );
}