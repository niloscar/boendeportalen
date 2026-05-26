import { useState } from 'react';
import type { SignUp } from '../../types/apartment.ts';
import Button from '../../components/ui/Button.tsx';

const ApartmentSignUp = ({ error, loading, applied, deleteSignUp, signUp }: SignUp) => {
    const [submitting, setSubmitting] = useState(false);
    const processing = async () => {
        setSubmitting(true)
        window.setTimeout(() => {setSubmitting(false)}, 500)
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
            <Button variant="secondary" size="md" type="button" children="Ta bort intresseanmälan" onClick={() => {deleteSignUp(); processing()}} disabled={submitting} />
        </>)
    }
    return (
        <>
            <Button variant="primary" size="md" type="button" children="Anmäl intresse" onClick={() => {signUp(); processing()}} disabled={submitting} />
        </>
    )
}

export default ApartmentSignUp
