import { supabase } from '../lib/supabase'
import type { CreateMessagePayload } from '../types/messages'


// TODO: export async function getMessagesForCurrentUser() {}

// TODO:export async function markMessageAsRead(messageId: string) {}

// TODO: export async function deleteMessageForCurrentUser(messageId: string) {}

export async function createMessage(payload: CreateMessagePayload) {
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) throw new Error('Du måste vara inloggad.')

    const recipientUserIds = await getRecipientUserIds(payload)

    if (recipientUserIds.length === 0) throw new Error('Inga mottagare hittades.')

    const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
            subject: payload.subject,
            body: payload.body,
            publish_at: payload.publishAt,
            sent_immediately: payload.sendImmediately,
            created_by_user_id: userData.user.id
        })
        .select('id')
        .single()

    if (messageError) throw messageError

    const recipientRows = recipientUserIds.map((userId) => ({
        message_id: message.id,
        user_id: userId
    }))

    const { error: recipientsError } = await supabase
        .from('message_recipients')
        .insert(recipientRows)

    if (recipientsError) throw recipientsError

    return message
}

async function getRecipientUserIds(payload: CreateMessagePayload) {
    const { recipientMode, filters } = payload

    let query = supabase
        .from('users')
        .select('id')
        .eq('status', 'active')
        .is('deleted_at', null)

    if (recipientMode === 'all_tenants') query = query.eq('role', 'tenant')

    if (recipientMode === 'filtered_users') {
        if (filters.isTenant) query = query.eq('role', 'tenant')

        if (filters.hasParkingSpace) query = query.eq('has_parking_space', true)

        if (filters.houseNumber) query = query.eq('house_number', filters.houseNumber)

        if (filters.stairwell) query = query.eq('stairwell', filters.stairwell)
    }

    const { data, error } = await query

    if (error) throw error

    return data.map((user) => user.id)
}