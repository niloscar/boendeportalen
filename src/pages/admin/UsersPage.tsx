import type { AdminSubPageProps } from '../../types/admin'

export default function UsersPage({ styles }: AdminSubPageProps) {
    return (
        <main className={`${styles['admin-subpage']} ${styles['users']}`}>
            <p>Här kan du se och hantera alla användare i boendeportalen.</p>
        </main>
    )
}