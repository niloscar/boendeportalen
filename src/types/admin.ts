import type { ComponentType } from 'react'

export type AdminSubPage = {
    slug: string
    title: string
    component: ComponentType
    authRequired: boolean
}