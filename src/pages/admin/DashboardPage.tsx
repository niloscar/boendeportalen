import { useState } from 'react'
import { useFeatures } from '../../hooks/useFeatures'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ExpandedWidget from '../../components/admin/ExpandedWidget'
import Widget from '../../components/admin/Widget'
import Issues from '../../components/admin/widgets/Issues'

import type { ComponentType } from 'react'

const WIDGET_COMPONENTS = {
    Issues
} satisfies Record<string, ComponentType>

function getWidgetComponent(componentName: string | null): ComponentType | null {
    if (!componentName) return null

    return WIDGET_COMPONENTS[componentName as keyof typeof WIDGET_COMPONENTS] ?? null
}

export default function DashboardPage() {
    const { loadError, features, loading } = useFeatures()
    const [expandedWidgetTitle, setExpandedWidgetTitle] = useState<string | null>(null)

    if (loading) return <p className="text-sm text-neutral-600 text-center w-full">Laddar kontrollpanel...</p>
    if (loadError) return <p className="text-red-600 text-center w-full">Kunde inte ladda kontrollpanel: {loadError}</p>

    const widgets = features
        .filter((feature) => (
            feature.is_active &&
            feature.type_slug === 'admin_widgets' &&
            getWidgetComponent(feature.component)
        ))
        .sort((a, b) => a.name.localeCompare(b.name, 'sv'))

    const expandedWidget = widgets.find(widget => widget.name === expandedWidgetTitle)

    return (
        <main>
            <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 960: 2 }}>
                <Masonry style={{ gap: 24 }} itemStyle={{ gap: 24 }}>
                    {widgets.map((widget) => {
                        const Component = getWidgetComponent(widget.component)

                        if (!Component) return null

                        return (
                            <Widget
                                key={widget.name}
                                title={widget.name}
                                description={widget.description}
                                onExpand={() => setExpandedWidgetTitle(widget.name)}
                            >
                                <Component />
                            </Widget>
                        )
                    })}
                </Masonry>
            </ResponsiveMasonry>

            {expandedWidget && (() => {
                const Component = getWidgetComponent(expandedWidget.component)

                if (!Component) return null

                return (
                    <ExpandedWidget
                        widgetSlug={expandedWidget.name}
                        description={expandedWidget.description}
                        onClose={() => setExpandedWidgetTitle(null)}
                    >
                        <Component />
                    </ExpandedWidget>
                )
            })()}
        </main>
    )
}