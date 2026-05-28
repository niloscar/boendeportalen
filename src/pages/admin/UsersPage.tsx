import { useEffect, useState } from "react"
import { getUsers } from "../../api/usersApi"

import type { Profile } from "../../types/profile"

export default function UsersPage() {
    const [users, setUsers] = useState<Profile[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const usersData = await getUsers()
                setUsers(usersData)
            } catch (error) {
                console.error('Kunde inte hämta användare:', error)
                setError('Kunde inte hämta användare')
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    if (loading) return <p>Laddar användare...</p>
    if (error) return <p>{error}</p>

    const handleEditUser = (user: Profile) => {
        // Här kan du implementera logiken för att redigera användaren, t.ex. öppna en modal eller navigera till en redigeringssida
        console.log('Redigera användare:', user)
    }

    return (
        <main>
            <p>Här kan du se och hantera alla användare i boendeportalen.</p>
            <table>
                <thead>
                    <tr className="text-left">
                        <th>Namn</th>
                        <th>Email</th>
                        <th>Roll</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.full_name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td><button onClick={() => handleEditUser(user)}>Redigera</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}