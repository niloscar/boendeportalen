import { useState, useEffect } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { getFeatures } from '../../api/settingsApi'
import ExpandedWidget from '../../components/admin/ExpandedWidget.tsx'
import Widget from '../../components/admin/Widget'

import type { Feature } from '../../types/admin.ts'

export default function DashboardPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [features, setFeatures] = useState([] as Feature[])
    const [expandedWidgetTitle, setExpandedWidgetTitle] = useState<string | null>(null)

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                setLoading(true)
                setError('')
                const data = await getFeatures();
                setFeatures(data)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchFeatures()
    }, [])

    if (loading) return <p className="text-sm text-neutral-600 text-center w-full">Laddar kontrollpanel...</p>
    if (error) return <p className="text-red-600 text-center w-full">Kunde inte ladda kontrollpanel: {error}</p>

    const widgets = features
        .filter((feature) => (feature.is_active && feature.type_slug === 'admin_widgets'))
        .sort((a, b) => a.name.localeCompare(b.name, 'sv'))
        .map((feature) => ({
            title: feature.name,
            description: feature.description,
            component: () => <></> // Placeholder content, replace with actual component when ready.
        }))

    const expandedWidget = widgets.find(widget => widget.title === expandedWidgetTitle)

    return (
        <main className="py-6">
            <ResponsiveMasonry columnsCountBreakPoints={{0: 1, 960: 2}}>
                <Masonry style={{ gap: 24 }} itemStyle={{ gap: 24 }}>
                    {widgets.map(widget => (
                        <Widget
                            key={widget.title}
                            title={widget.title}
                            description={widget.description}
                            onExpand={() => setExpandedWidgetTitle(widget.title)}
                        >
                            {widget.component()}
                        </Widget>
                    ))}
                </Masonry>
            </ResponsiveMasonry>

            {expandedWidget && (
                <ExpandedWidget
                    widgetSlug={expandedWidget.title}
                    description={expandedWidget.description}
                    onClose={() => setExpandedWidgetTitle(null)}
                >
                    {expandedWidget.component()}
                </ExpandedWidget>
            )}
        </main>
    )
}