import type { ComponentType } from 'react'

export type AdminPageStyles = Record<string, string>

export type AdminSubPageProps = {
    styles: AdminPageStyles
}

export type AdminSubPage = {
    slug: string
    title: string
    component: ComponentType<AdminSubPageProps>
    authRequired: boolean
}