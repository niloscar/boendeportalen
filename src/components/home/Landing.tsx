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
            <section className='rounded-2xl border border-neutral-200 p-6 shadow-md sm:p-8 w-full text-neutral-700 bg-gradient-to-br from-white via-white to-green-50 '>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl font-bold sm:text-4xl">Välkommen till Boende<span className="text-green-500">Portalen</span>, {profileName}!</h1>
                        <p className="text-neutral-700">Här i BoendePortalen hittar du allt som rör ditt boende hos oss.</p>
                    </div>
                    <div className="text-neutral-700">
                        <p>Du hittar dina uppgifter under <Link to='/minasidor' className="text-green-500">Mina sidor</Link>. Här kan du uppdatera din personliga information, och se status på dina förfrågningar. </p>
                    </div>
                </div>
            </section>
            {(!loading && !loadError && visibleFeatures.length > 0) && (
                <section className="grid lg:grid-cols-2 gap-6 w-full">
                    {visibleFeatures.map((feature) => (
                        <Link to={featureRoutes[feature.slug] ?? '/'} key={feature.id}>
                            <article className='flex gap-4 rounded-2xl border border-neutral-200 bg-gradient-to-br from-white via-white to-green-50 p-6 shadow-md p-6 sm:p-8 w-full ' >
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
                            </article>
                        </Link>
                    ))}
                </section>
            )}
        </>
    )
}