import { Link } from 'react-router-dom'
import { CarIcon, HouseLineIcon, ShieldCheckIcon, CoinsIcon, SparkleIcon } from '@phosphor-icons/react'
import type { LandingProps } from '../../types/home'

const featureRoutes: Record<string, string> = {
    parkeringar: '/parkeringar',
    bostader: '/bostader',
}

const marketingCards = [
    {
        title: 'Tryggt och smidigt',
        text: 'Samla allt som rör boendet på samma plats och slipp onödiga mejltrådar och papperslappar.',
        icon: <ShieldCheckIcon size={22} className="text-green-600" />,
    },
    {
        title: 'Prisvärt boende',
        text: 'Vi erbjuder smarta lösningar för boende, parkering och service som gör vardagen enklare och mer prisvärd.',
        icon: <CoinsIcon size={22} className="text-green-600" />,
    },
    {
        title: 'Service som gör skillnad',
        text: 'Snabb tillgång till viktiga funktioner, uppdaterad information och en portal som är byggd för att underlätta.',
        icon: <SparkleIcon size={22} className="text-green-600" />,
    },
]

export default function Home({ loading, loadError, visibleFeatures }: LandingProps) {
    const userImageUrl = 'https://zavnweqhytaqbpswyhcl.supabase.co/storage/v1/object/sign/apartment-files/Apartment%20images/bedroom_2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OTQzZjBmNi0yY2Y4LTQ1MzAtYWYwMi0yNzI2YmI0NDVhNDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcGFydG1lbnQtZmlsZXMvQXBhcnRtZW50IGltYWdlcy9iZWRyb29tXzIuanBnIiwiaWF0IjoxNzc5OTcxNjAxLCJleHAiOjE4MTE1MDc2MDF9.ibaq1PP6TtvVZs2GxSGNQMEIlzlI-UTDK56A7RaHRY4'

    return (
        <>
            <img src={userImageUrl} className="h-48 w-full object-cover rounded-2xl shadow-md" />
            <section className="w-full rounded-3xl border border-green-100 bg-gradient-to-br from-white via-white to-green-50 p-6 shadow-md sm:p-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl font-bold text-green-600 sm:text-4xl">Välkommen till BoendePortalen</h1>
                        <p className="text-neutral-700">Här samlar vi allt på ett ställe: uppgifter, ansökningar och funktioner som gör ditt boende smidigare.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Link to="/inloggning" className="inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600">Logga in</Link>
                        <p className="text-sm text-neutral-600">Logga in för att se personliga uppgifter och tjänster.</p>
                    </div>
                </div>
            </section>
            <h1 className="text-2xl font-bold">Varför välja oss?</h1>
            <section className="grid w-full gap-6 md:grid-cols-3">
                {marketingCards.map((card) => (
                    <article key={card.title} className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-gradient-to-br from-white via-white to-green-50 p-6 shadow-md">
                        <div className="flex items-center gap-3">
                            {card.icon}
                            <h2 className="text-xl font-semibold text-neutral-900">{card.title}</h2>
                        </div>
                        <p className="text-sm text-neutral-700">{card.text}</p>
                    </article>
                ))}
            </section>
            {!loading && !loadError && visibleFeatures.length > 0 && (
                <>
                    <h1 className="text-2xl font-bold">Hitta enkelt hos oss</h1>
                    <section className="grid grid-cols-2 gap-6 w-full">
                        {visibleFeatures.map((feature) => (
                            <Link to={featureRoutes[feature.slug] ?? '/'} key={feature.id}>
                                <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8 w-full flex gap-4' >
                                    <div className='self-center'>
                                        {feature.slug === 'parkeringar' && <CarIcon size={32} className="text-green-500" />}
                                        {feature.slug === 'bostader' && <HouseLineIcon size={32} className="text-green-500" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg">{feature.name}</h3>
                                        <p>{feature.description}</p>
                                    </div>
                                </section>
                            </Link>
                        ))}
                    </section>
                </>
            )}
        </>
    )
}