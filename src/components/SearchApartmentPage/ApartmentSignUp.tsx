import type { SignUp } from '../../types/apartment.ts';
import Button from '../../components/ui/Button.tsx';

const ApartmentSignUp = ({ error, loading, saved, applied, deleted, deleteSignUp, signUp }: SignUp) => {

    if (error) {
        return (<div>Kunde inte skapa intresseanmälan. Vänligen försök igen.</div>)
    }
    if (loading) {
        return (<div>Skickar begäran...</div>)
    }
    if (saved == 200 || saved == 201) {
        return (<div>Intresseanmälan inskickad!</div>)
    }
    if (applied.length > 0) {
        return (<div>
            {deleted != 204 ?
                <Button variant="primary" size="md" type="button" children="Ta bort intresseanmälan" onClick={deleteSignUp} /> :
                <Button variant="primary" size="md" type="button" children="Anmäl intresse" onClick={signUp} />}
        </div>)
    }
    return (
        <div>
            <Button variant="primary" size="md" type="button" children="Anmäl intresse" onClick={signUp} />
        </div>
    )
}

export default ApartmentSignUp
