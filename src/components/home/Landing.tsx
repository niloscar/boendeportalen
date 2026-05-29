import { Link } from 'react-router-dom'
import { WashingMachineIcon, DoorOpenIcon, CarIcon, HouseLineIcon } from '@phosphor-icons/react'
import type { LandingProps } from '../../types/home'

const featureRoutes: Record<string, string> = {
    tvattstuga: '/tvattstuga',
    gastlagenhet: '/gastlagenhet',
    parkeringar: '/parkeringar',
    bostader: '/bostader',
}

export default function Landing({ profileName, loading, loadError, visibleFeatures }: LandingProps) {
    const userImageUrl = 'https://zavnweqhytaqbpswyhcl.supabase.co/storage/v1/object/sign/apartment-files/Apartment%20images/bedroom_2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OTQzZjBmNi0yY2Y4LTQ1MzAtYWYwMi0yNzI2YmI0NDVhNDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcGFydG1lbnQtZmlsZXMvQXBhcnRtZW50IGltYWdlcy9iZWRyb29tXzIuanBnIiwiaWF0IjoxNzc5OTcxNjAxLCJleHAiOjE4MTE1MDc2MDF9.ibaq1PP6TtvVZs2GxSGNQMEIlzlI-UTDK56A7RaHRY4'

    return (
        <>
            <img src={userImageUrl} className="h-48 w-full object-cover rounded-2xl" />
            <h1 className="text-3xl font-bold">Välkommen till Boende<span className="text-green-500">Portalen</span>, {profileName}!</h1>
            <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8 w-full text-neutral-700'>
                <div className="p-2">
                    <p>Här i BoendePortalen hittar du allt som rör ditt boende hos oss.</p>
                </div>
                <div className="p-2">
                    <p>Du hittar dina uppgifter under <Link to='/minasidor' className="text-green-500">Mina sidor</Link>. Här kan du uppdatera din personliga information, och se status på dina förfrågningar. </p>
                </div>
            </section>
            {(!loading && !loadError && visibleFeatures.length > 0) && (
                <section className="grid grid-cols-2 gap-6 w-full">
                    {visibleFeatures.map((feature) => (
                        <Link to={featureRoutes[feature.slug] ?? '/'} key={feature.id}>
                            <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8 w-full flex gap-4' >
                                <div className='self-center'>
                                    {feature.slug === 'tvattstuga' &&
                                        <WashingMachineIcon size={32} className="text-green-500" />
                                    }
                                    {
                                        feature.slug === 'gastlagenhet' &&
                                        <DoorOpenIcon size={32} className="text-green-500" />
                                    }
                                    {
                                        feature.slug === 'parkeringar' &&
                                        <CarIcon size={32} className="text-green-500" />
                                    }
                                    {
                                        feature.slug === 'bostader' &&
                                        <HouseLineIcon size={32} className="text-green-500" />
                                    }
                                </div>
                                <div>
                                    <h3 className="text-lg text-neutral-900 font-semibold">{feature.name}</h3>
                                    <p className="text-neutral-700">{feature.description}</p>
                                </div>
                            </section>
                        </Link>
                    ))}
                </section>
            )}
        </>
    )
}