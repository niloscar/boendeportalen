import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useFeatures } from '../hooks/useFeatures'
import { useProfileData } from '../hooks/useProfileData';
import { WashingMachineIcon, DoorOpenIcon, CarIcon, HouseLineIcon } from "@phosphor-icons/react"

export default function HomePage() {
    const { loading, loadError, visibleFeatures } = useFeatures()
    const { user, loading: userLoading} = useAuth();
    const userId = user?.id ?? '';
    const {
        profile,
    } = useProfileData(userId, userLoading);

    return (
        <main className="w-full flex flex-col gap-6 justify-start items-center">
            {loading  || userLoading && <p className="text-sm text-neutral-600">Laddar funktioner...</p>}
            {loadError && <p className="text-sm text-red-600">Kunde inte ladda funktioner: {loadError}</p>}
            {user &&
                <>
                    <img src="https://zavnweqhytaqbpswyhcl.supabase.co/storage/v1/object/sign/apartment-files/Apartment%20images/bedroom_2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OTQzZjBmNi0yY2Y4LTQ1MzAtYWYwMi0yNzI2YmI0NDVhNDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcGFydG1lbnQtZmlsZXMvQXBhcnRtZW50IGltYWdlcy9iZWRyb29tXzIuanBnIiwiaWF0IjoxNzc5OTcxNjAxLCJleHAiOjE4MTE1MDc2MDF9.ibaq1PP6TtvVZs2GxSGNQMEIlzlI-UTDK56A7RaHRY4" className="h-48 w-full object-cover rounded-xl" />
                    <h1 className="text-2xl font-bold">Välkommen till Boende<span className="text-green-500">Portalen</span> {profile?.full_name}!</h1>
                    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8 w-full'>
                        <div className="p-2">
                            <p>Här i BoendePortalen hittar du allt som rör ditt boende hos oss.</p>
                        </div>
                        <div className="p-2">
                            <p>Du hittar dina uppgifter under <Link to='/minasidor' className="text-green-500">Mina sidor</Link>. Här kan du uppdatera din personliga information, och se status på dina förfrågningar. </p>
                        </div>
                    </section>
                    {!loading && !loadError && visibleFeatures.length > 0 && (
                        <section className="grid grid-cols-2 gap-6 w-full">
                            {visibleFeatures.map((feature) => (
                                <Link to={feature.id === 30 ? '/tvattstuga' : feature.id === 31 ? '/gastlagenhet' : feature.id === 29 ? '/parkeringar' : feature.id === 28 ? '/bostader' : '/'} key={feature.id}>
                                    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8 w-full flex gap-4' >
                                        <div className='self-center'>
                                            {feature.id === 30 &&
                                                <WashingMachineIcon size={32} className="text-green-500" />
                                            }
                                            {
                                                feature.id === 31 &&
                                                <DoorOpenIcon size={32} className="text-green-500" />
                                            }
                                            {
                                                feature.id === 29 &&
                                                <CarIcon size={32} className="text-green-500" />
                                            }
                                            {
                                                feature.id === 28 &&
                                                <HouseLineIcon size={32} className="text-green-500" />
                                            }
                                        </div>
                                        <div>
                                            <h3 className="text-lg">{feature.name}</h3>
                                            <p>{feature.description}</p>
                                        </div>
                                    </section>
                                </Link>
                            ))}
                        </section>
                    )}

                </>
            }

            {!user &&
                <p>
                    <Link to="/inloggning" className="underline text-green-500">Logga in</Link> för att se mer av webbplatsen.
                </p>
            }
        </main>
    )
}