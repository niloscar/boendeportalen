import Masonry from 'react-masonry-css'
import Widget from '../../components/admin/Widget'
import Tenants from '../../components/admin/widgets/Tenants'
import type { AdminSubPageProps } from '../../types/admin'

const WIDGETS = [
    {
        title: 'Boende',
        description: 'Här kan du se och hantera alla boende i föreningen.',
        component: Tenants,
    },
    {
        title: 'Meddelanden',
        description: 'Här kan du skicka meddelanden till boende i föreningen.',
        component: () => <p>Test</p>,
    },
    {
        title: 'Inkomna problem / störningar',
        description: 'Här kan du se och hantera inkomna problem och störningar i föreningen.',
        component: () => <p>Test</p>,
    },
    {
        title: 'Hantera resurser',
        description: 'Här kan du hantera disponibla bostäder, förrådsutrymmen, lokaler, garage och parkeringar som ska vara tillgängliga för uthyrning eller bokning för föreningens medlemmar.',
        component: () => <p>Test</p>,
    },
    {
        title: 'Evenemang',
        description: 'Här kan du lägga till och redigera evenemang och händelser.',
        component: () => <p>Test</p>,
    },
    {
        title: 'Våra funktioner',
        description: 'Här kan du välja vilka funktioner som ska vara tillgängliga för denna förening.',
        component: () => <p>Test</p>,
    },
]

export default function DashboardPage({ styles }: AdminSubPageProps) {

    return (
        <main className={`${styles['admin-subpage']} ${styles['dashboard']}`}>
            <Masonry
                breakpointCols={2}
                className={styles['widget-area']}
                columnClassName={styles['widget-area-column']}>
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
        </main>
    )
}