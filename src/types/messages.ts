import type { Dispatch } from 'react'

export type Step = 'recipients' | 'message' | 'schedule' | 'review' | 'sent'

export type RecipientMode =
    | 'all_tenants'
    | 'filtered_users'
    | 'single_user'

export type RecipientFilters = {
    isTenant: boolean
    hasParkingSpace: boolean
    houseNumber: string
    stairwell: string
}

export type MessageState = {
    step: Step
    recipientMode: RecipientMode | null
    selectedUserIds: string[]
    filters: RecipientFilters
    subject: string
    body: string
    publishAt: string
    sendImmediately: boolean
    isSubmitting: boolean
    errorMessage: string | null
}

export type MessageAction =
    | { type: 'SET_STEP'; payload: Step }
    | { type: 'NEXT_STEP' }
    | { type: 'PREVIOUS_STEP' }
    | { type: 'SET_RECIPIENT_MODE'; payload: RecipientMode }
    | { type: 'SET_SELECTED_USERS'; payload: string[] }
    | { type: 'SET_FILTER'; payload: Partial<RecipientFilters> }
    | { type: 'SET_SUBJECT'; payload: string }
    | { type: 'SET_BODY'; payload: string }
    | { type: 'SET_PUBLISH_AT'; payload: string }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_ERROR'; payload: string }
    | { type: 'CONFIRM_MESSAGE'; payload: { sendImmediately: boolean } }
    | { type: 'RESET' }

export type MessagesFormStepProps = {
    state: MessageState
    dispatch: Dispatch<MessageAction>
}

export type CreateMessagePayload = {
    recipientMode: RecipientMode
    filters: RecipientFilters
    selectedUserIds: string[]
    subject: string
    body: string
    publishAt: string
    sendImmediately: boolean
}