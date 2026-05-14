import AdminSection from './AdminSection'
import AdminResidents from './AdminResidents'

const ADMIN_SECTIONS = [
    {
        title: 'Boende',
        description: 'Här kan du se och hantera alla boende i föreningen.',
        component: AdminResidents,
    },
    // {
    //     title: 'Meddelanden',
    //     description: 'Här kan du skicka meddelanden till boende i föreningen.',
    //     component: () => <p>Test</p>,
    // },
    // {
    //     title: 'Inkomna problem / störningar',
    //     description: 'Här kan du se och hantera inkomna problem och störningar i föreningen.',
    //     component: () => <p>Test</p>,
    // },
    // {
    //     title: 'Hantera resurser',
    //     description: 'Här kan du hantera disponibla bostäder, förrådsutrymmen, lokaler, garage och parkeringar som ska vara tillgängliga för uthyrning eller bokning för föreningens medlemmar.',
    //     component: () => <p>Test</p>,
    // },
    // {
    //     title: 'Evenemang',
    //     description: 'Här kan du lägga till och redigera evenemang och händelser.',
    //     component: () => <p>Test</p>,
    // },
    // {
    //     title: 'Våra funktioner',
    //     description: 'Här kan du välja vilka funktioner som ska vara tillgängliga för denna förening.',
    //     component: () => <p>Test</p>,
    // },
]

export default function AdminDashboard() {

    return (
        <>
            {ADMIN_SECTIONS.map(section => (
                <AdminSection
                    key={section.title}
                    title={section.title}
                    description={section.description}
                >
                    {section.component()}
                </AdminSection>
            ))}
        </>
    )
}