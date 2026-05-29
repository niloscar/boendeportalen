import { useState } from 'react'
import { useFeatures } from '../../hooks/useFeatures'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ExpandedWidget from '../../components/admin/ExpandedWidget'
import Widget from '../../components/admin/Widget'
import Issues from '../../components/admin/widgets/Issues'
import Messages from '../../components/admin/widgets/messages/Messages'
import Tenants from '../../components/admin/widgets/Tenants'

import type { ComponentType } from 'react'

const WIDGET_COMPONENTS = {
    Issues,
    Messages,
    Tenants,
    Resources: () => <p>Hantera uthyrningsbara resurser.</p>,
}

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
        <>
            <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 960: 2 }}>
                <Masonry style={{ gap: 16 }} itemStyle={{ gap: 16 }}>
                    {widgets.map((widget) => {
                        const Component = getWidgetComponent(widget.component)

                        if (!Component) return null

                        return (
                            <Widget
                                key={widget.name}
                                title={widget.name}
                                slug={widget.slug}
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
                const component = renderWidgetComponent(expandedWidget.component, { expanded: true })

                if (!component) return null

                return (
                    <ExpandedWidget
                        title={expandedWidget.name}
                        slug={expandedWidget.slug}
                        description={expandedWidget.description}
                        onClose={() => setExpandedWidgetTitle(null)}
                    >
                        {component}
                    </ExpandedWidget>
                )
            })()}
        </>
    )
}

function renderWidgetComponent(componentName: string | null, props?: { expanded?: boolean }) {
    if (!componentName) return null

    switch (componentName) {
        case 'Tenants':
            return <Tenants rowsPerPage={props?.expanded ? 20 : undefined} />

        case 'Issues':
            return <Issues />

        case 'Messages':
            return <Messages />

        case 'Resources':
            return <p>Hantera uthyrningsbara resurser.</p>

        default:
            return null
    }
}