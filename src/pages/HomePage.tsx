import { useAuth } from '../hooks/useAuth'
import { useFeatures } from '../hooks/useFeatures'
import { useProfileData } from '../hooks/useProfileData';
import Landing from '../components/home/Landing'
import Home from '../components/home/Home'

export default function HomePage() {
    const { loading, loadError, visibleFeatures } = useFeatures()
    const { user, loading: userLoading } = useAuth();
    const userId = user?.id ?? '';
    const {
        profile,
    } = useProfileData(userId, userLoading);

    return (
        <main className="w-full flex flex-col gap-6 justify-start items-center">
            {loading || userLoading && <p className="text-sm text-neutral-600">Laddar funktioner...</p>}
            {loadError && <p className="text-sm text-red-600">Kunde inte ladda funktioner: {loadError}</p>}
            {user ? (
                <Landing
                    profileName={profile?.full_name}
                    loading={loading}
                    loadError={loadError}
                    visibleFeatures={visibleFeatures}
                />
            ) : (
                <Home
                    loading={loading}
                    loadError={loadError}
                    visibleFeatures={visibleFeatures}
                />
            )}
        </main>
    )
}