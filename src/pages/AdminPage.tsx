import { Navigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../contexts/useAuthContext'
import { hasAdminAccess } from '../utils/accessControl'

import AdminDashboard from './admin/DashboardPage'
import AdminUsers from './admin/UsersPage'
import AdminSettings from './admin/SettingsPage'
import Breadcrumbs from '../components/ui/Breadcrumbs'

import type { AdminSubPage } from '../types/admin'
import DropDown from '../components/ui/DropDown'

const ADMIN_SUB_PAGES = [
    { slug: 'dashboard', title: 'Kontrollpanel', component: AdminDashboard, authRequired: true },
    { slug: 'users', title: 'Hantera användare', component: AdminUsers, authRequired: true },
    { slug: 'settings', title: 'Inställningar', component: AdminSettings, authRequired: true },
] satisfies readonly AdminSubPage[]

const dashboardPage = ADMIN_SUB_PAGES[0]

const CRUMBS = [
    { title: 'Administration', href: '/admin' }
]

export default function AdminPage() {
    const { profile } = useAuthContext()
    const { '*': slug } = useParams<{ '*'?: string }>()
    
    const isAdmin = hasAdminAccess(profile)

    if (!isAdmin) return <Navigate to={`/inloggning`} replace />
    if (isAdmin && !slug) return <Navigate to={`/admin/${dashboardPage.slug}`} replace />

    const currentPage = ADMIN_SUB_PAGES.find(page => page.slug === slug) || dashboardPage
    const SubPageComponent = currentPage.component

    return (
        <div className="container p-6 flex flex-col gap-6">
            <h1 className="text-3xl md:text-5xl m-0">Administration</h1>
            
            <DropDown
                fallbackTitle='Administration'
                items={ADMIN_SUB_PAGES.map((page) => ({
                    to: `/admin/${page.slug}`,
                    title: page.title
                }))}
            />

            <SubPageComponent />

            <Breadcrumbs crumbs={[...CRUMBS, { title: currentPage.title }]} />
        </div>
    );
}
