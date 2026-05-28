import apiConfig from './axiosConfig'
import { supabase } from '../lib/supabase'
import type { CreateMessagePayload, MessageResponse, MessageRecipientCandidate } from '../types/messages'

// TODO: export async function markMessageAsRead(messageId: string) {}

// TODO: export async function deleteMessageForCurrentUser(messageId: string) {}




export async function getMessagesForCurrentUser() {
    try {
        const response = await apiConfig.get('/my_messages', {
            params: {
                select: '*',
                order: 'publish_at.desc'
            }
        })

        return response.data
    } catch (error) {
        console.error(`Kunde inte hämta meddelanden, ${error}`)
        throw error
    }
}

export async function createMessage(payload: CreateMessagePayload) {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData.user) throw new Error('Du måste vara inloggad.')

        const recipientUserIds = await getRecipientUserIds(payload)
        if (recipientUserIds.length === 0) throw new Error('Inga mottagare hittades med de aktuella filtren.')

        const messageResponse = await apiConfig.post<MessageResponse[]>(
            '/messages',
            {
                subject: payload.subject,
                body: payload.body,
                publish_at: new Date(payload.publishAt).toISOString(),
                sent_immediately: payload.sendImmediately,
                created_by_user_id: userData.user.id
            },
            {
                params: { select: 'id' },
                headers: { Prefer: 'return=representation' }
            }
        )

        const message = messageResponse.data[0]

        const recipientRows = recipientUserIds.map((userId) => ({
            message_id: message.id,
            user_id: userId
        }))

        await apiConfig.post(
            '/message_recipients',
            recipientRows
        )

        return message
    } catch (error) {
        console.error(`Kunde inte skapa meddelande, ${error}`)
        throw error
    }
}

async function getRecipientUserIds(payload: CreateMessagePayload) {
    const {
        recipientMode,
        filters,
        selectedUserIds
    } = payload

    if (recipientMode === 'single_user') return selectedUserIds

    const params: Record<string, string> = { select: 'user_id' }

    if (recipientMode === 'all_tenants') { params.is_tenant = 'eq.true' }

    if (recipientMode === 'filtered_users') {
        if (filters.isTenant) params.is_tenant = 'eq.true'

        if (filters.hasParkingSpace) params.has_parking_space = 'eq.true'

        if (filters.houseNumber) params.house_number = `eq.${Number(filters.houseNumber)}`

        if (filters.stairwell) params.stairwell = `eq.${filters.stairwell.toUpperCase()}`
    }

    const response = await apiConfig.get<MessageRecipientCandidate[]>(
        '/message_recipient_candidates',
        { params }
    )

    return [...new Set(response.data.map((recipient) => recipient.user_id))]
}