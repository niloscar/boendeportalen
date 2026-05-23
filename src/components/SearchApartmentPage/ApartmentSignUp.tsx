import type { SignUp } from '../../types/apartment.ts';
import Button from '../../components/ui/Button.tsx';

const ApartmentSignUp = ({ error, loading, saved, applied, deleted, deleteSignUp, signUp }: SignUp) => {
    if (error) {
        return (<div>
            <Button variant="primary" size="md" type="button" children="Anmäl intresse" onClick={signUp} />
            <p>Kunde inte skapa intresseanmälan. Vänligen försök igen.</p>
        </div>)
    }
    if (loading) {
        return (<Button variant="secondary" size="md" type="button" children="Skickar din förfrågan" disabled/>)
    }
    if (saved == 200 || saved == 201) {
        return (<Button variant="primary" size="md" type="button" children="Ta bort intresseanmälan" onClick={deleteSignUp} />)
    }
    if (applied.length > 0) {
        return (<>
            {deleted != 204 ?
                <Button variant="primary" size="md" type="button" children="Ta bort intresseanmälan" onClick={deleteSignUp} /> :
                <Button variant="primary" size="md" type="button" children="Anmäl intresse" onClick={signUp} />}
        </>)
    }
    return (
        <>
            <Button variant="primary" size="md" type="button" children="Anmäl intresse" onClick={signUp} />
        </>
    )
}

export default ApartmentSignUp
