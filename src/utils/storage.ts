export function saveToLocalStorage<T>(key: string, value: T, TTL: number = 3600000) {
    try {
        const serializedValue = JSON.stringify(value)
        localStorage.setItem(key, serializedValue)
        setTimeout(() => {
            localStorage.removeItem(key)
        }, TTL)
    } catch (error) {
        console.error('Error saving to localStorage:', error)
    }
}

export function getFromLocalStorage<T>(key: string): T | null {
    try {
        const serializedValue = localStorage.getItem(key)
        if (serializedValue === null) {
            return null
        }
        return JSON.parse(serializedValue) as T
    } catch (error) {
        console.error('Error getting from localStorage:', error)
        return null
    }
}

export function removeFromLocalStorage(key: string) {
    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.error('Error removing from localStorage:', error)
    }
}