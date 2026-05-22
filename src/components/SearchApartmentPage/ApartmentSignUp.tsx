import { useState, useEffect } from 'react';
import type { ApartmentProp } from '../../types/apartment.ts';
import { apartmentSignUp } from '../../api/apartmentApi.ts';
import { useSession } from '../../hooks/useAuth';
import Button from '../../components/ui/Button.tsx';

const ApartmentSignUp = ({ apartment }: ApartmentProp) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(400);
    const endDate = Temporal.PlainDate.from(apartment.end_date);
    const activeUntil = endDate.add({ weeks: 2 });
    const session = useSession();

    const signUp = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await apartmentSignUp(session?.access_token, apartment.id, activeUntil);
            setSaved(data);
            console.log(saved)
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }
    // useEffect(() => {
    //     (async () => {
    //         await signUp();
    //     })();
    // }, []);
    if (error) {
        return (<div>Kunde inte skapa intresseanmälan. Vänligen försök igen.</div>)
    }
    if (loading) {
        return (<div>Skickar begäran...</div>)
    }
    if (saved == 200 || saved == 201) {
        return (<div>Intresseanmälan inskickad!</div>)
    }
    return (
        <div>
            <Button variant="primary" size="md" type="button" children="Anmäl intresse" onClick={signUp} />
        </div>
    )
}

export default ApartmentSignUp
