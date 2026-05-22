import { ArrowsOutSimpleIcon } from "@phosphor-icons/react"

import type { ReactNode } from 'react'

import styles from './Widget.module.css'

export default function Widget({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <section className="p-4 border border-gray-200 rounded-2xl w-full flex flex-col gap-3 relative">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p>{description}</p>
            {children}
            <button aria-label="Expandera" className={styles['expand-button']} disabled>
                <ArrowsOutSimpleIcon size={20} />
            </button>
        </section>
    )
}