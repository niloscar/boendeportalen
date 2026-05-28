import { Link } from 'react-router-dom'
import { signOut } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useFeatures } from '../hooks/useFeatures'
import { useProfileData } from '../hooks/useProfileData';

export default function HomePage() {
    const { loading, loadError, visibleFeatures } = useFeatures()
    const { user } = useAuth();
    const userId = user?.id ?? '';
    const {
        clearLoadError,
        profile,
        setProfile,
        contract,
        documentUrls,
        apartmentInfo,
        manualDocuments,
        floorPlanDocument,
        appliedApartments,
        myParking,
        appliedParking,
    } = useProfileData(userId, loading);


    return (
        <main className="w-full flex flex-col gap-6 justify-start items-center">
            {loading && <p className="text-sm text-neutral-600">Laddar funktioner...</p>}
            {loadError && <p className="text-sm text-red-600">Kunde inte ladda funktioner: {loadError}</p>}
            {user &&
                <>
                    <h1 className="text-2xl font-bold">Välkommen till Boendeportalen {profile?.full_name}!</h1>

                    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8 w-full'>
                        <div className='flex items-center gap-4'>
                            <p>Här i Boendeportalen har du din kontakt till hyresvärden. </p>
                        </div>
                    </section>
                    {!loading && !loadError && visibleFeatures.length > 0 && (
                        <section className="grid grid-cols-2 gap-6 w-full">
                            {visibleFeatures.map((feature) => (
                                <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8 w-full'>
                                    <h3>{feature.name}</h3>
                                    <p>{feature.description}</p>
                                    <p>{feature.id}</p>
                                    <p></p>
                                </section>
                            ))}
                        </section>
                    )}

                </>

            }

            {!user &&
                <p>
                    <Link to="/inloggning" className="underline">Logga in</Link> för att se mer av webbplatsen.
                </p>}

            {user &&
                <div className="flex gap-4 items-center">
                    <p className="text-green-600">Inloggad som {user.email}</p>
                    <button
                        onClick={async () => { await signOut(); window.location.reload() }}
                        className="py-1 px-4 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700"
                    >
                        Logga ut
                    </button>
                </div>}
        </main>
    )
}