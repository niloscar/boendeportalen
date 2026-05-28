import { useReducer } from "react"
import { createMessage } from "../../../../api/messagesApi"
import { getRecipients, getRecipientSummary } from "./recipientSummary"
import { Button } from "../../../ui/Button"
import { getCurrentDateTimeLocalValue } from "../../../../utils/currentDateTimeLocal"
import SelectDropDown from '../../../ui/SelectDropDown'
import FormSwitch from '../../../ui/FormSwitch'
import { ArrowLeftIcon, ArrowRightIcon, PaperPlaneRightIcon, TimerIcon } from '@phosphor-icons/react'

import type { SelectDropDownItem } from '../../../ui/SelectDropDown'
import type { 
    Step,
    MessageState, 
    MessageAction, 
    RecipientMode, 
    RecipientFilters,
    MessagesFormStepProps
} from "../../../../types/messages"

const initialState: MessageState = {
    step: 'recipients',
    recipientMode: null,
    selectedUserIds: [],
    filters: {
        isTenant: false,
        hasParkingSpace: false,
        houseNumber: '',
        stairwell: ''
    },
    subject: '',
    body: '',
    publishAt: getCurrentDateTimeLocalValue(),
    sendImmediately: false,
    isSubmitting: false,
    errorMessage: null
}

function messageReducer(
    state: MessageState,
    action: MessageAction
): MessageState {
    const steps: Step[] = [
        'recipients',
        'message',
        'schedule',
        'review',
        'sent'
    ]

    function getPreviousStep(currentStep: Step): Step {
        const currentIndex = steps.indexOf(currentStep)
        return steps[Math.max(currentIndex - 1, 0)]
    }

    function getNextStep(currentStep: Step): Step {
        const currentIndex = steps.indexOf(currentStep)
        return steps[Math.min(currentIndex + 1, steps.length - 1)]
    }

    switch (action.type) {
        case 'SET_STEP':
            return {
                ...state,
                step: action.payload
            }

        case 'NEXT_STEP':
            return {
                ...state,
                step: getNextStep(state.step)
            }

        case 'PREVIOUS_STEP':
            return {
                ...state,
                step: getPreviousStep(state.step)
            }

        case 'SET_RECIPIENT_MODE':
            return {
                ...state,
                recipientMode: action.payload,
                selectedUserIds: [],
                filters: initialState.filters
            }

        case 'SET_SELECTED_USERS':
            return {
                ...state,
                selectedUserIds: action.payload
            }

        case 'SET_FILTER':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...action.payload
                }
            }

        case 'SET_SUBJECT':
            return {
                ...state,
                subject: action.payload
            }

        case 'SET_BODY':
            return {
                ...state,
                body: action.payload
            }

        case 'SET_PUBLISH_AT':
            return {
                ...state,
                publishAt: action.payload
            }
        case 'SUBMIT_START':
            return {
                ...state,
                isSubmitting: true,
                errorMessage: null
            }

        case 'SUBMIT_ERROR':
            return {
                ...state,
                isSubmitting: false,
                errorMessage: action.payload
            }

        case 'CONFIRM_MESSAGE':
            return {
                ...state,
                isSubmitting: false,
                errorMessage: null,
                sendImmediately: action.payload.sendImmediately,
                step: 'sent'
            }
        case 'RESET':
            return initialState

        default:
            return state
    }
}

export default function Messages() {
    const [state, dispatch] = useReducer(messageReducer, initialState)

    return (
        <div className="flex flex-col">
            {state.step === 'recipients' && <RecipientsStep state={state} dispatch={dispatch} />}
            {state.step === 'message' && <MessageStep state={state} dispatch={dispatch} />}
            {state.step === 'schedule' && <ScheduleStep state={state} dispatch={dispatch} />}
            {state.step === 'review' && <ReviewStep state={state} dispatch={dispatch} />}
            {state.step === 'sent' && <SuccessStep state={state} dispatch={dispatch} />}
        </div>
    )
}

function RecipientsStep({ state, dispatch }: MessagesFormStepProps) {

    const handleSelectRecipientMode = (recipientMode: RecipientMode) => {
        dispatch({
            type: 'SET_RECIPIENT_MODE',
            payload: recipientMode
        })
    }

    const handleFilterRecipientChange = (
        key: keyof RecipientFilters,
        value: RecipientFilters[keyof RecipientFilters]
    ) => {
        dispatch({
            type: 'SET_FILTER',
            payload: {
                [key]: value
            }
        })
    }

    const recipientOptions: SelectDropDownItem<RecipientMode>[] = [
        {
            value: 'all_tenants',
            title: 'Alla hyresgäster'
        },
        {
            value: 'filtered_users',
            title: 'Specifika användare eller hyresgäster'
        }
    ]

    const recipientSummary = getRecipientSummary(state)
    const canContinue = Boolean(state.recipientMode)

    return (
        <div className="flex flex-col gap-6 mt-2">
            <SelectDropDown
                items={recipientOptions}
                value={state.recipientMode}
                onChange={handleSelectRecipientMode}
                fallbackTitle="Välj mottagare"
                ariaLabel="Välj mottagare för meddelande"
            />

            {state.recipientMode === 'filtered_users' && (
                <div className="flex flex-col gap-3">
                    <div className="from-group flex items-center gap-2">
                        <FormSwitch 
                            id="isTenant"
                            name="isTenant"
                            checked={state.filters.isTenant}
                            onSwitchChange={(_, checked) => handleFilterRecipientChange('isTenant', checked)}
                        />
                        Är hyresgäst
                    </div>

                    {state.filters.isTenant && (
                    <fieldset className="flex flex-col gap-2">
                        <div className="input-group flex items-center gap-2">
                            <label className="w-1/2">
                                <span className="block text-sm mb-1">Husnummer</span>
                                <input
                                    type="number"
                                    className="text-sm w-full border border-neutral-300 rounded-xl px-4 py-2"
                                    placeholder="T.ex. 17"
                                    value={state.filters.houseNumber}
                                    onChange={(event) => handleFilterRecipientChange(
                                        'houseNumber',
                                        event.target.value
                                    )}
                                />
                            </label>
                            <label className="w-1/2">
                                <span className="block text-sm mb-1">Trappuppgång</span>
                                <input
                                    type="text"
                                    className={`${!state.filters.houseNumber ? 'bg-neutral-100' : ''} text-sm w-full border border-neutral-300 rounded-xl px-4 py-2`}
                                    placeholder="T.ex. A"
                                    value={state.filters.stairwell}
                                    onChange={(event) => handleFilterRecipientChange(
                                        'stairwell',
                                        event.target.value
                                    )}
                                    disabled={!state.filters.houseNumber}
                                />
                            </label>
                        </div>
                        <i className="text-sm text-neutral-500 mb-2">
                            Fälten lämnas tomma för att skicka till alla hyresgäster.
                        </i>
                    </fieldset>
                    )}

                    <div className="from-group flex items-center gap-2">
                        <FormSwitch 
                            id="hasParkingSpace"
                            name="hasParkingSpace"
                            checked={state.filters.hasParkingSpace}
                            onSwitchChange={(_, checked) => handleFilterRecipientChange('hasParkingSpace', checked)}
                        />
                        Har parkeringsplats
                    </div>
                </div>
            )}

            {canContinue && (
                <>
                    <hr className="border-neutral-300" />
                    <p className="text-sm text-green-600">{recipientSummary}</p>

                    <Button
                        type="button"
                        className="inline-flex self-end items-center gap-2 pr-4"
                        disabled={!canContinue}
                        onClick={() => dispatch({ type: 'NEXT_STEP' })}
                    >
                        Nästa <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                </>
            )}
        </div>
    )
}

function MessageStep({state, dispatch}: MessagesFormStepProps) {
    const isSubjectValid = state.subject.trim().length > 0
    const isBodyValid = state.body.trim().length > 0
    const canContinue = isSubjectValid && isBodyValid

    return (
        <div className="flex flex-col mt-2 gap-6">
            <label className="text-sm text-gray-700">
                <span className="block text-sm mb-1">Ämne</span>
                <input
                    type="text"
                    className="text-sm border border-neutral-300 outline-green-500 rounded-xl px-4 py-3 w-full"
                    placeholder="Ämne"
                    value={state.subject}
                    onChange={(event) => dispatch({
                        type: 'SET_SUBJECT',
                        payload: event.target.value
                    })}
                />
            </label>

            <label className="text-sm text-gray-700">
                <span className="block text-sm mb-1">Meddelande</span>
                <textarea
                    className="text-sm border border-neutral-300 outline-green-500 rounded-xl p-4 w-full h-32"
                    placeholder="Skriv ditt meddelande här..."
                    value={state.body}
                    onChange={(event) => dispatch({
                        type: 'SET_BODY',
                        payload: event.target.value
                    })}
                />
            </label>

            <div className="button-group flex justify-between">
                <Button
                    className="inline-flex items-center gap-2 pl-4"
                    onClick={() => dispatch({ type: 'PREVIOUS_STEP' })}
                >
                    <ArrowLeftIcon className="h-4 w-4" /> Tillbaka
                </Button>

                <Button
                    className="inline-flex items-center gap-2 pr-4 disabled:opacity-50 transition-opacity transition-duration-500"
                    onClick={() => dispatch({ type: 'NEXT_STEP' })}
                    disabled={!canContinue}
                >
                    Nästa <ArrowRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

function ScheduleStep({ state, dispatch }: MessagesFormStepProps) {
    return (
        <div className="flex flex-col mt-2 gap-6">
            <label className="text-sm text-gray-700">
                <span className="block text-sm mb-1">Välj datum och tid för utskicket</span>
                <input
                    type="datetime-local"
                    className="text-sm border border-neutral-300 rounded-xl px-4 py-3 w-full outline-green-500"
                    placeholder="Välj datum och tid för utskicket"
                    value={state.publishAt}
                    onChange={(event) => dispatch({
                        type: 'SET_PUBLISH_AT',
                        payload: event.target.value
                    })}
                />
            </label>

            <div className="button-group flex justify-between">
                <Button
                    className="inline-flex items-center gap-2 pl-4"
                    onClick={() => dispatch({ type: 'PREVIOUS_STEP' })}
                >
                    <ArrowLeftIcon className="h-4 w-4" /> Tillbaka
                </Button>

                <Button
                    className="inline-flex items-center gap-2 pr-4"
                    onClick={() => dispatch({ type: 'NEXT_STEP' })}
                >
                    Nästa <ArrowRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

function ReviewStep({ state, dispatch }: MessagesFormStepProps) {
    async function handleSubmitMessage() {
        if (!state.recipientMode) {
            dispatch({
                type: 'SUBMIT_ERROR',
                payload: 'Välj mottagare innan du skickar utskicket.'
            })

            return
        }

        dispatch({ type: 'SUBMIT_START' })

        try {
            await createMessage({
                recipientMode: state.recipientMode,
                filters: state.filters,
                selectedUserIds: state.selectedUserIds,
                subject: state.subject,
                body: state.body,
                publishAt: state.publishAt,
                sendImmediately
            })

            dispatch({
                type: 'CONFIRM_MESSAGE',
                payload: {
                    sendImmediately
                }
            })
        } catch (error) {
            console.error(error)

            dispatch({
                type: 'SUBMIT_ERROR',
                payload: 'Det gick inte att skapa utskicket. Försök igen.'
            })
        }
    }

    const recipients = getRecipients(state)
    const currentDateTime = getCurrentDateTimeLocalValue()
    const sendImmediately = currentDateTime >= state.publishAt

    const ucFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

    const submitButtonContent = state.isSubmitting
        ? sendImmediately
            ? 'Skickar...'
            : 'Schemalägger...'
        : sendImmediately
            ? (
                <>
                    Skicka
                    <PaperPlaneRightIcon className="h-4 w-4" />
                </>
            )
            : (
                <>
                    Schemalägg
                    <TimerIcon className="h-4 w-4" />
                </>
            )

    return (
        <div className="flex flex-col mt-2 gap-6">
            <section className="flex flex-col gap-3 bg-neutral-100 p-4 rounded-xl">
                <div>
                    <p className="text-sm text-gray-700">Mottagare</p>
                    <p>{ucFirst(recipients)}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-700">Ämne</p>
                    <p>{state.subject}</p>
                </div>


                <div>
                    <p className="text-sm text-gray-700">Meddelande</p>
                    <p>{state.body}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-700">Skickas</p>
                    <p>{sendImmediately ? 'Omedelbart' : new Date(state.publishAt).toLocaleString()}</p>
                </div>
            </section>

            <div className="button-group flex justify-between">
                <Button
                    className="inline-flex items-center gap-2 pl-4"
                    onClick={() => dispatch({ type: 'PREVIOUS_STEP' })}
                >
                    <ArrowLeftIcon className="h-4 w-4" /> Tillbaka
                </Button>

                <Button
                    className="inline-flex items-center gap-2 pr-4"
                    onClick={handleSubmitMessage}
                    disabled={state.isSubmitting}
                >
                    {submitButtonContent}
                </Button>
            </div>
        </div>
    )
}

function SuccessStep({ state, dispatch }: MessagesFormStepProps) {
    return (
        <div className="flex flex-col gap-6 mt-2">
            <p className="text-green-600 text-sm flex gap-1 items-center">
                {state.sendImmediately ? (
                    <>
                        <PaperPlaneRightIcon className="h-4 w-4" />
                        <span>Meddelandet har skickats!</span>
                    </>
                ) : (
                    <>
                        <TimerIcon className="h-4 w-4" />
                        <span>Meddelandet har schemalagts för utskick!</span>
                    </>
                )}
            </p>
            <Button
                className="inline-flex items-center gap-2 pr-4 self-start"
                onClick={() => dispatch({ type: 'RESET' })}
            >
                Skapa nytt utskick
            </Button>
        </div>
    )
}