import type { MessageState } from '../../../../types/messages'

export function getRecipients(state: MessageState): string {
    const { recipientMode, filters } = state

    if (recipientMode === 'all_tenants') return 'alla hyresgäster'

    if (recipientMode === 'filtered_users') {
        const parts: string[] = [
            filters.isTenant ? 'hyresgäster' : 'användare'
        ]

        if (filters.stairwell) parts.push(`i trappuppgång ${filters.stairwell}`)
        if (filters.houseNumber) parts.push(`i hus ${filters.houseNumber}`)
        if (filters.hasParkingSpace) parts.push('som har en parkeringsplats')

        return `alla ${parts.join(' ')}`
    }

    return ''
}

export function getRecipientSummary(state: MessageState): string {
    const { recipientMode } = state
    const defaultMessage = 'Välj mottagare för meddelandet.'

    if (!recipientMode) return defaultMessage

    const recipients = getRecipients(state)
    if (!recipients) return defaultMessage

    return `Skickar utskick till ${recipients}.`
}