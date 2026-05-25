import type { SignUp } from '../../types/apartment.ts';
import Button from '../../components/ui/Button.tsx';

const ApartmentSignUp = ({ error, loading, applied, deleteSignUp, signUp }: SignUp) => {
    if (error) {
        return (<div>
            <p>Någonting gick fel, vänligen ladda om sidan för att anmäla eller ta bort intresseanmälan.</p>
        </div>)
    }
    if (loading) {
        return (<Button variant="secondary" size="md" type="button" children="Skickar din förfrågan" disabled />)
    }
    if (applied.length > 0) {
        return (<>
            <Button variant="secondary" size="md" type="button" children="Ta bort intresseanmälan" onClick={deleteSignUp} />
        </>)
    }
    return (
        <>
            <Button variant="primary" size="md" type="button" children="Anmäl intresse" onClick={signUp} />
        </>
    )
}

export default ApartmentSignUp
