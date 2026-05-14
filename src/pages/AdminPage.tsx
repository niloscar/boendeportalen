import { useParams } from 'react-router-dom'
import AdminNav from '../components/AdminNav'
import AdminDashboard from '../components/AdminDashboard'
import AdminUsers from '../components/AdminUsers'
import AdminSettings from '../components/AdminSettings'
import type { ComponentType } from 'react'

type AdminSubPage = {
    slug: string
    title: string
    component: ComponentType
}

const ADMIN_SUB_PAGES = [
    { slug: 'dashboard', title: 'Kontrollpanel', component: AdminDashboard },
    { slug: 'users', title: 'Hantera användare', component: AdminUsers },
    { slug: 'settings', title: 'Inställningar', component: AdminSettings },
] satisfies readonly AdminSubPage[]

export default function AdminPage() {
    const params = useParams<{ slug?: string }>()
    const currentSlug = params.slug ?? ADMIN_SUB_PAGES[0].slug

    const currentPage = ADMIN_SUB_PAGES.find(
        page => page.slug === currentSlug
    ) ?? ADMIN_SUB_PAGES[0]

    const Component = currentPage.component;

    return (
        <div className="p-8">
            <AdminNav />

            <div className="text-sm text-gray-500 mb-2">
                Administration → {currentPage.title}
            </div>

            <h1 className="text-2xl font-bold mb-4">
                {currentPage.title}
            </h1>

            <main className="flex flex-wrap gap-8 max-w-7xl">
                <Component />
            </main>
        </div>
    );
}