import { useLocation, Link } from 'react-router-dom';
import ImageCarousel from '../components/SearchApartmentPage/ImageCarousel.tsx';
import Button from '../components/ui/Button.tsx';
import ApartmentList from '../components/SearchApartmentPage/ApartmentList.tsx';
import type { ApartmentData, Detail } from '../types/apartment.ts';
import ApartmentSignUp from '../components/SearchApartmentPage/ApartmentSignUp.tsx';
import { SignUpCalls } from '../hooks/SignUpCalls.tsx';
import { useSession } from '../hooks/useAuth.ts';

const Apartment = () => {
    const location = useLocation();
    const session = useSession();
    const state = location.state as
        | { apartment: ApartmentData; details: Detail[] }
        | undefined;
    const apartment: ApartmentData | null = state?.apartment ?? null;
    const details: Detail[] | null = state?.details ?? null;
    if (!apartment || !details) {
        return (
            <div className="max-w-3xl">
                <Link to="/apartment">
                    <Button variant="primary" size="md" type="button" children="Tillbaka till sök" />
                </Link>
                <p>Kunde inte hämta information om lägenheten. Vänligen gå tillbaka och försök igen.</p>
            </div>
        )
    }
    const {
        signUp,
        deleteSignUp,
        loading,
        error,
        saved,
        applied,
        deleted } = SignUpCalls({ apartment });

    return (
        <section className="flex flex-col gap-6 p-6 max-w-3xl">
            <div className="flex justify-between">
                <h1 className="text-5xl">{apartment.street}</h1>
                {session && <ApartmentSignUp error={error} loading={loading} saved={saved} applied={applied} deleted={deleted} deleteSignUp={deleteSignUp} signUp={signUp} />}
            </div>
            <ImageCarousel images={apartment.images} size="large" />
            <h2 className="text-2xl">Om bostaden</h2>
            <p>{apartment.description}</p>
            <h2 className="text-2xl">Visning</h2>
            <p>Visning sker två veckor innan sista ansökningsdag. Du kommer att få en kallelse. Vänligen notera att visningstiden ej går att boka om. Om du inte kan delta i person går det bra att skicka en ersättare med giltlig legitimation. </p>
            <h2 className="text-2xl">Detaljer</h2>
            <ul className="max-w-md">
                <ApartmentList variant="ul" items={details} />
            </ul>
            {session ?
                <ApartmentSignUp error={error} loading={loading} saved={saved} applied={applied} deleted={deleted} deleteSignUp={deleteSignUp} signUp={signUp} /> :
                <div>Du måste vara inloggad för att anmäla intressse. Vänligen <a href="/auth" className="text-blue-500 hover:underline">logga in</a> eller registrera ett konto.</div>
            }
        </section>
    )
}

export default Apartment
