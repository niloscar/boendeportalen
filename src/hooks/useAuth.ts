import { useAuthContext } from '../contexts/useAuthContext'

export function useAuth() {
    return useAuthContext()
}

export default useAuth

export function useUser() {
    const { user } = useAuth()
    return user
}

export function useSession() {
    const { session } = useAuth()
    return session
}