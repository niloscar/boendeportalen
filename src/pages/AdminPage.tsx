import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AdminLoginForm from '../components/AdminLoginForm'
import AdminNav from '../components/AdminNav'
import AdminDashboard from '../components/AdminDashboard'
import AdminUsers from '../components/AdminUsers'
import AdminSettings from '../components/AdminSettings'
// import Breadcrumbs from '../components/ui/BreadCrumbs'
import type { ComponentType } from 'react'

type AdminSubPage = {
    slug: string
    title: string
    component: ComponentType
    authRequired: boolean
}

const ADMIN_SUB_PAGES = [
    { slug: 'login', title: 'Logga in', component: AdminLoginForm, authRequired: false },
    { slug: 'dashboard', title: 'Kontrollpanel', component: AdminDashboard, authRequired: true },
    { slug: 'users', title: 'Hantera användare', component: AdminUsers, authRequired: true },
    { slug: 'settings', title: 'Inställningar', component: AdminSettings, authRequired: true },
] satisfies readonly AdminSubPage[]

const loginPage = ADMIN_SUB_PAGES[0]
const dashboardPage = ADMIN_SUB_PAGES[1]

// const CRUMBS = [
//     { title: 'Administration', href: '/admin' },
//     { title: 'Administration' },
// ]

export default function AdminPage() {
    const { isAuthenticated } = useAuth()
    const { slug } = useParams<{ slug?: string }>()

    if (!isAuthenticated && slug !== loginPage.slug) return <Navigate to={`/admin/${loginPage.slug}`} replace />
    if (isAuthenticated && (!slug || slug === loginPage.slug)) return <Navigate to={`/admin/${dashboardPage.slug}`} replace />

    const currentPage = ADMIN_SUB_PAGES.find(page => page.slug === slug) || dashboardPage
    const Component = currentPage.component

    const navPages = ADMIN_SUB_PAGES.filter(page => (
        isAuthenticated ? page.authRequired : !page.authRequired
    ))

    return (
        <div className="fakeBody h-screen flex bg-neutral-200 justify-center">
            <div className="fakeApp w-full max-w-7xl bg-white p-8">

                <h1 className="text-2xl font-bold mb-4">
                    Administration → {currentPage.title}
                </h1>

                {isAuthenticated && <AdminNav pages={navPages} />}

                {/* <Breadcrumbs crumbs={[...CRUMBS, { title: currentPage.title }]} /> */}

                <main className="flex flex-wrap gap-8 max-w-7xl">
                    <Component />
                </main>
            </div>
        </div>
    );
}