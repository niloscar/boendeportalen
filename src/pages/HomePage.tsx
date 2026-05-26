import { Link } from 'react-router-dom'
import { signOut } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useFeatures } from '../hooks/useFeatures'

export default function HomePage() {
    const { user } = useAuth()
    const { loading, loadError, features } = useFeatures()

    const filteredFeatures = features.filter(feature => feature.is_active && feature.type_slug === 'tenant_features')

    return (
        <main className="p-6 flex gap-6 flex-col">
            
            <h1 className="text-2xl font-bold">Välkommen till Boendeportalen!</h1>
            <p>Det här är en placeholder för startsidan.</p>

            {!user && 
                <p>
                    <Link to="/auth" className="underline">Logga in</Link> för att se mer av webbplatsen.
                </p>}

            {user && loading && <p className="text-sm text-neutral-600">Laddar funktioner...</p> }
            {user && loadError && <p className="text-sm text-red-600">Kunde inte ladda funktioner: {loadError}</p>}
            {user && !loading && !loadError && filteredFeatures.length > 0 && (
                <ul>
                    {filteredFeatures.map((feature) => (
                        <li key={feature.id}>
                            {feature.name} - {feature.description}
                        </li>
                    ))}
                </ul>
            )}

            {user && 
                <div className="flex gap-4 items-center">
                    <p className="text-green-600">Inloggad som {user?.email}</p>
                    <button onClick={async () => { await signOut(); window.location.reload(); }} className="py-1 px-4 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700">Logga ut</button>
                </div>}
        </main>
    )
}