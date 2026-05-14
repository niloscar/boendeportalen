import { type ReactNode } from 'react'

export default function AdminSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <section className="p-4 border rounded-2xl max-w-150 w-full flex flex-col gap-3">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p>{description}</p>
            {children}
        </section>
    )
}