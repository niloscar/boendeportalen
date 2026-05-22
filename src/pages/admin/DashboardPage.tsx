import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import Widget from '../../components/admin/Widget'
import type { AdminSubPageProps } from '../../types/admin'

const WIDGETS = [
    {
        title: 'Exempelwidget 1',
        description: 'Denna widget är bara en demonstration och har ingen verklig funktionalitet.',
        component: () => <p>Widget-innehåll</p>, // Replace with actual component when ready.
    },
    {
        title: 'Exempelwidget 2',
        description: 'Denna widget är bara en demonstration och har ingen verklig funktionalitet.',
        component: () => <p>Widget-innehåll</p>, // Replace with actual component when ready.
    }
]

export default function DashboardPage({ styles }: AdminSubPageProps) {

    return (
        <main className={`${styles['admin-subpage']} ${styles['dashboard']}`}>
            <ResponsiveMasonry columnsCountBreakPoints={{0: 1, 960: 2}}>
                <Masonry style={{ gap: 24 }} itemStyle={{ gap: 24 }}>
                    {WIDGETS.map(widget => (
                        <Widget
                            key={widget.title}
                            title={widget.title}
                            description={widget.description}
                        >
                            {widget.component()}
                        </Widget>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </main>
    )
}