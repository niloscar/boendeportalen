import { Navigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../contexts/useAuthContext'
import { hasAdminAccess } from '../utils/accessControl'

import AdminNav from '../components/admin/Nav'
import AdminDashboard from './admin/DashboardPage'
import AdminUsers from './admin/UsersPage'
import AdminSettings from './admin/SettingsPage'
import Breadcrumbs from '../components/ui/Breadcrumbs'

import type { Profile } from '../types/profile'
import type { AdminSubPage } from '../types/admin'
import type { AuthError } from '@supabase/supabase-js'

type AdminPageProps = {
    profile: Profile | null
    signOut: () => Promise<{ error: AuthError | null }>
}

const ADMIN_SUB_PAGES = [
    { slug: 'dashboard', title: 'Kontrollpanel', component: AdminDashboard, authRequired: true },
    { slug: 'users', title: 'Hantera användare', component: AdminUsers, authRequired: true },
    { slug: 'settings', title: 'Inställningar', component: AdminSettings, authRequired: true },
] satisfies readonly AdminSubPage[]

const dashboardPage = ADMIN_SUB_PAGES[0]

const CRUMBS = [
    { title: 'Administration', href: '/admin' }
]

export default function AdminPage({ signOut }: AdminPageProps) {
    const { profile } = useAuthContext()
    const { '*': slug } = useParams<{ '*'?: string }>()
    
    const isAdmin = hasAdminAccess(profile)

    if (!isAdmin) return <Navigate to={`/auth`} replace />
    if (isAdmin && !slug) return <Navigate to={`/admin/${dashboardPage.slug}`} replace />

    const currentPage = ADMIN_SUB_PAGES.find(page => page.slug === slug) || dashboardPage
    const SubPageComponent = currentPage.component

    return (
        <div className="container p-6 flex flex-col gap-6">
            <h1 className="text-3xl md:text-5xl m-0">Administration</h1>
            
            <Breadcrumbs crumbs={[...CRUMBS, { title: currentPage.title }]} />

            <AdminNav pages={ADMIN_SUB_PAGES} signOut={signOut} />

            <SubPageComponent />
        </div>
    );
}