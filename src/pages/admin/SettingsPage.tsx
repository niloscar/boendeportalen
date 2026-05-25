import { useEffect, useState } from 'react'
import { getFeatures } from '../../api/settingsApi.ts'

export default function SettingsPage() {
    const [features, setFeatures] = useState([])

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const featuresData = await getFeatures()
                setFeatures(featuresData)
            } catch (error) {
                console.error('Error fetching features:', error)
            }
        }

        fetchFeatures()
    }, [])

    console.log('Fetched features:', features)

    return (
        <main>
            {/* <h2 className="text-xl font-bold text-neutral-900">Aktiva widgets</h2>
            <p className="my-4">Här kan du välja vilka widgets som ska vara aktiva i Boendeportalen.</p>
            <form className="flex flex-col gap-4">
                {features.map((feature) => (
                    <label className="flex items-center gap-2 cursor-pointer" key={feature.id}>
                        <input type="checkbox" name={feature.name} className="form-checkbox cursor-pointer" />
                        <span>{feature.name}</span>
                    </label>
                ))}
                <button type="submit" className="self-start py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Spara inställningar</button>
            </form> */}
        </main>
    )
}
