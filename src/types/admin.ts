import type { ComponentType, ReactNode } from 'react'

export type AdminSubPage = {
    slug: string
    title: string
    component: ComponentType
    authRequired: boolean
}

export type Feature = {
    id: number
    name: string
    slug: string
    description: string | null
    type_name: string
    type_slug: string
    type_description: string | null
    is_active: boolean
    component: string | null
}

export type FeaturesByType = Record<string, {
    type_name: string
    type_description: string | null
    features: Feature[]
}>

export type WidgetProps = {
    title: string
    description: string | null
    children: ReactNode
    onExpand: () => void
}