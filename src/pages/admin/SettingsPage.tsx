import { useMemo, useState } from 'react'
import { useFeatures } from '../../hooks/useFeatures'
import { Button } from '../../components/ui/Button'
import FormSwitch from '../../components/ui/FormSwitch'

import type { SubmitEventHandler } from 'react'
import type { FeaturesByType } from '../../types/features'

type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

export default function SettingsPage() {
    const { loadError, features, loading, toggleFeature, saveFeatures } = useFeatures()
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

    const handleSwitchChange = (featureId: number, featureTypeId: number, isChecked: boolean) => {
        setSaveStatus('idle')
        toggleFeature(featureId, featureTypeId, isChecked)
    }

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        setSaveStatus('saving')

        const minSavingTime = wait(600)

        try {
            await saveFeatures()
            await minSavingTime

            setSaveStatus('success')
            setTimeout(() => { setSaveStatus('idle') }, 1500)
        } catch {
            await minSavingTime

            setSaveStatus('error')
            setTimeout(() => { setSaveStatus('idle') }, 2000)
        }
    }

    const sortedFeatureGroups = useMemo(() => {
        const visibleSettingsFeatures = features.filter((feature) =>
            feature.type_slug !== 'admin_widgets' || feature.component !== null
        )

        const featuresByType = visibleSettingsFeatures.reduce<FeaturesByType>((groupedFeatures, feature) => {
            if (!groupedFeatures[feature.type_slug]) {
                groupedFeatures[feature.type_slug] = {
                    type_name: feature.type_name,
                    type_description: feature.type_description,
                    features: []
                }
            }

            groupedFeatures[feature.type_slug].features.push(feature)

            return groupedFeatures
        }, {})

        return Object.entries(featuresByType)
            .map(([type, group]) => ({
                type,
                ...group,
                features: [...group.features].sort((a, b) =>
                    a.name.localeCompare(b.name, 'sv', { sensitivity: 'base' })
                )
            }))
            .sort((a, b) => {
                const aLevel = Math.min(...a.features.map(feature => feature.user_level))
                const bLevel = Math.min(...b.features.map(feature => feature.user_level))

                return aLevel - bLevel
            })
    }, [features])

    const buttonText = {
        idle: 'Spara inställningar',
        saving: 'Sparar...',
        success: 'Inställningarna sparade!',
        error: 'Kunde inte spara!'
    }[saveStatus]

    const buttonClassName = [
        'px-5 py-2.5 md:self-end text-white transition-colors',
        saveStatus === 'success' && 'bg-green-500',
        saveStatus === 'error' && 'bg-red-700',
        (saveStatus === 'idle' || saveStatus === 'saving') && 'bg-neutral-900 hover:bg-neutral-800'
    ].filter(Boolean).join(' ')

    if (loading) return <p className="text-sm text-neutral-600 text-center w-full">Laddar inställningar...</p>
    if (loadError) return <p className="text-red-600 text-center w-full">Kunde inte ladda inställningar: {loadError}</p>

    return (
        <>
            <form className="flex flex-col gap-6 md:items-start" onSubmit={ handleSubmit }>

                {sortedFeatureGroups.map(({ type, type_name, type_description, features }) => (
                    <fieldset key={type}>
                        <h2 className="text-xl font-bold text-neutral-900">{type_name}</h2>
                        {type_description && <p className="my-2">{type_description}</p>}
                        <table className="my-4 text-left border-collapse">
                            <tbody>
                                {features.map((feature) => (
                                    <tr key={`${type}-${feature.id}`}>
                                        <td className="px-2">
                                            <div className="flex h-full items-center">
                                                <FormSwitch
                                                    id={`${type}-${feature.slug}`}
                                                    name={`${feature.id}-${feature.feature_type_id}`}
                                                    checked={feature.is_active}
                                                    onSwitchChange={(_, isChecked) => {
                                                        handleSwitchChange(feature.id, feature.feature_type_id, isChecked)
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="align-middle px-2 py-1 font-medium text-neutral-900">
                                            {feature.name}
                                        </td>
                                        <td className="align-middle px-2 py-1 text-neutral-600 text-sm">
                                            {feature.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </fieldset>
                ))}

                <Button 
                    type="submit"
                    variant="custom"
                    disabled={saveStatus !== 'idle'} 
                    className={buttonClassName}
                >
                    {buttonText}
                </Button>
            </form>
        </>
    )
}

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}