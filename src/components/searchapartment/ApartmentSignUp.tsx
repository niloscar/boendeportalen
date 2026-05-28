import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { SignUp } from '../../types/apartment.ts';
import Button from '../../components/ui/Button.tsx';

const ApartmentSignUp = ({ error, loading, applied, totalApplications, deleteSignUp, signUp }: SignUp) => {
    const [submitting, setSubmitting] = useState(false);
    const processing = async () => {
        setSubmitting(true)
        window.setTimeout(() => { setSubmitting(false) }, 500)
    }

    if (error) {
        return (<div>
            <p>Kunde inte hämta intresseanmälan. Vänligen ladda om sidan. </p>
        </div>)
    }
    if (loading) {
        return (<Button variant="secondary" size="md" type="button" children="Skickar din förfrågan" disabled />)
    }
    if (applied.length > 0) {
        return (<>
            <Button variant="secondary" size="md" type="button" children="Ta bort intresseanmälan" onClick={() => { deleteSignUp(); processing() }} disabled={submitting} />
        </>)
    }
    if (totalApplications.length >= 3) {
        return (
          <div className="mt-10">Du får max ha tre ansökningar samtidigt. Om du vill ansöka om denna lägenhet, vänligen ta bort en annan ansökan. Du hittar dina ansökningar under <Link to="/minasidor" className="text-green-500 hover:underline">Mina sidor</Link>.</div>
        )
    }
    return (
        <>
            <Button variant="primary" size="md" type="button" children="Anmäl intresse" onClick={() => { signUp(); processing() }} disabled={submitting} />
        </>
    )
}

export default ApartmentSignUp
