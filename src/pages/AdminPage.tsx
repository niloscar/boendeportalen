import { Navigate, useParams } from 'react-router-dom'
import AdminLoginForm from '../components/admin/LoginForm'
import AdminNav from '../components/admin/Nav'
import AdminDashboard from './admin/DashboardPage'
import AdminUsers from './admin/UsersPage'
import AdminSettings from './admin/SettingsPage'
import Breadcrumbs from '../components/ui/Breadcrumbs'

import type { Profile } from '../types/profile'
import type { AdminSubPage } from '../types/admin'

import styles from './AdminPage.module.css'

const ADMIN_SUB_PAGES = [
    { slug: 'dashboard', title: 'Kontrollpanel', component: AdminDashboard, authRequired: true },
    { slug: 'users', title: 'Hantera användare', component: AdminUsers, authRequired: true },
    { slug: 'settings', title: 'Inställningar', component: AdminSettings, authRequired: true },
] satisfies readonly AdminSubPage[]

const loginPage = { slug: 'auth', title: 'Logga in', component: AdminLoginForm, authRequired: false }
const dashboardPage = ADMIN_SUB_PAGES[0]

const CRUMBS = [
    { title: 'Administration', href: '/admin' }
]

export default function AdminPage({ profile, signOut }: { profile: Profile | null; signOut: () => void }) {
    const isAuthenticated = Boolean(profile?.isAdmin || profile?.role === 'admin')
    const { '*': slug } = useParams<{ '*'?: string }>()

    if (!isAuthenticated && slug !== loginPage.slug) return <Navigate to={`/${loginPage.slug}`} replace />
    if (isAuthenticated && (!slug || slug === loginPage.slug)) return <Navigate to={`/admin/${dashboardPage.slug}`} replace />

    const currentPage = ADMIN_SUB_PAGES.find(page => page.slug === slug) || dashboardPage
    const SubPageComponent = currentPage.component

    const navPages = ADMIN_SUB_PAGES.filter(page => (
        isAuthenticated ? page.authRequired : !page.authRequired
    ))

    return (
        <div className="fakeBody min-h-screen flex bg-neutral-200 justify-center">
            <div className="fakeApp w-full max-w-7xl bg-white p-6 flex flex-col gap-6">

                <h1 className="text-2xl font-bold m-0">
                    Administration {/* → {currentPage.title} */}
                </h1>

                {isAuthenticated && <AdminNav profile={profile} pages={navPages} signOut={signOut} />}

                <Breadcrumbs crumbs={[...CRUMBS, { title: currentPage.title }]} />

                <SubPageComponent styles={styles} />
            </div>
        </div>
    );
}