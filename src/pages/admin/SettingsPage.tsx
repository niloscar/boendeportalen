import type { AdminSubPageProps } from '../../types/admin'

export default function SettingsPage({ styles }: AdminSubPageProps) {
    return (
        <main className={`${styles['admin-subpage']} ${styles['settings']}`}>
            <p>Här kan du se och hantera alla inställningar i boendeportalen.</p>
        </main>
    )
}