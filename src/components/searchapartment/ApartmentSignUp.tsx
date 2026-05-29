import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ApartmentProp } from '../../types/apartment.ts';
import Button from '../../components/ui/Button.tsx';
import { useApartmentSignUp } from '../../hooks/useApartmentSignUp.ts';


const ApartmentSignUp = ({ apartment }: ApartmentProp) => {
    const {
        signUp,
        deleteSignUp,
        loading,
        error,
        loadingStatus,
        errorStatus,
        loadingSignUp,
        errorSignUp,
        loadingRemove,
        errorRemove,
        applied,
        totalApplications
    } = useApartmentSignUp({ apartment });

    if (error || errorStatus || errorSignUp || errorRemove) {
        return (<div>
            <p>Kunde inte hämta information om ansökning. Vänligen ladda om sidan. </p>
        </div>)
    }
    if (loadingSignUp || loadingRemove) {
        return (<Button variant="secondary" size="md" type="button" children="Skickar din förfrågan" disabled />)
    }
    if (loading || loadingStatus) {
        return (<Button variant="secondary" size="md" type="button" children="Hämtar ansökningsstatus" disabled />)
    }
    if (applied.length > 0) {
        return (<>
            <Button variant="secondary" size="md" type="button" children="Ta bort intresseanmälan" onClick={deleteSignUp} disabled={loadingSignUp || loadingRemove || loading || loadingStatus} />
        </>)
    }
    if (totalApplications.length >= 3) {
        return (
            <div className="mt-10">Du får max ha tre ansökningar samtidigt. Om du vill ansöka om denna lägenhet, vänligen ta bort en annan ansökan. Du hittar dina ansökningar under <Link to="/minasidor" className="text-green-500 hover:underline">Mina sidor</Link>.</div>
        )
    }
    return (
        <>
            <Button variant="primary" size="md" type="button" children="Anmäl intresse" onClick={signUp} disabled={loadingSignUp || loadingRemove || loading || loadingStatus}/>
        </>
    )
}

export default ApartmentSignUp
