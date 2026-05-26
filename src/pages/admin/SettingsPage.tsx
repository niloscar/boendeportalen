import { useState } from 'react'
import { useFeatures } from '../../hooks/useFeatures'
import { Button } from '../../components/ui/Button'

import type { ChangeEventHandler, SubmitEventHandler } from 'react'
import type { FeaturesByType } from '../../types/admin'

type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

export default function SettingsPage() {
    const { loadError, features, loading, toggleFeature, saveFeatures } = useFeatures()
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const featureSlug = e.target.name
        const isChecked = e.target.checked

        setSaveStatus('idle')
        toggleFeature(featureSlug, isChecked)
    }

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        try {
            setSaveStatus('saving')
            await saveFeatures()
            setSaveStatus('success')

            setTimeout(() => { setSaveStatus('idle') }, 1500)
        } catch {
            setSaveStatus('error')

            setTimeout(() => { setSaveStatus('idle') }, 2000)
        }
    }

    if (loading) return <p className="text-sm text-neutral-600 text-center w-full">Laddar inställningar...</p>
    if (loadError) return <p className="text-red-600 text-center w-full">Kunde inte ladda inställningar: {loadError}</p>

    const featuresByType = features.reduce((groupedFeatures, feature) => {
        if (!groupedFeatures[feature.type_slug]) {
            groupedFeatures[feature.type_slug] = {
                type_name: feature.type_name,
                type_description: feature.type_description,
                features: []
            }
        }

        groupedFeatures[feature.type_slug].features.push(feature)

        return groupedFeatures
    }, {} as FeaturesByType)

    Object.values(featuresByType).forEach((group) => {
        group.features.sort((a, b) => (
            a.name.localeCompare(b.name, 'sv', { sensitivity: 'base' })
        ))
    })

    const buttonText = {
        idle: 'Spara inställningar',
        saving: 'Sparar...',
        success: 'Inställningarna sparade!',
        error: 'Kunde inte spara!'
    }[saveStatus]

    return (
        <main className="py-6">
            <form className="flex flex-col gap-6 md:items-start" onSubmit={ handleSubmit }>

                {Object.entries(featuresByType).map(([type, { type_name, type_description, features }]) => (
                    <fieldset key={type}>
                        <h2 className="text-xl font-bold text-neutral-900">{type_name}</h2>
                        {type_description && <p className="my-2">{type_description}</p>}
                        <table className="my-4 text-left border-collapse">
                            <tbody>

                                {features.map((feature) => (
                                    <tr key={feature.id}>
                                        <td className="px-2 py-1">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type='checkbox'
                                                    name={feature.slug}
                                                    className='form-checkbox cursor-pointer accent-neutral-900 hover:accent-neutral-800'
                                                    checked={feature.is_active}
                                                    onChange={handleChange}
                                                />
                                                <span className="sr-only">{`Aktivera ${feature.name}`}</span>
                                                <h3 className="text-md font-bold text-neutral-900">{feature.name}</h3>
                                            </label>
                                        </td>
                                        <td className="px-2 py-1 text-neutral-600 text-sm">{feature.description}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </fieldset>
                ))}

                <Button 
                    type="submit" 
                    disabled={saveStatus !== 'idle'} 
                    className="px-8 py-4"
                >
                    {buttonText}
                </Button>
            </form>
        </main>
    )
}
