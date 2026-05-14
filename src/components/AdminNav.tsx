import { NavLink } from 'react-router-dom'

type AdminSubPage = { slug: string, title: string }
type AdminNavProps = { pages: AdminSubPage[] }

export default function AdminNav({ pages }: AdminNavProps) {
    return (
        <nav className="my-4">
            <ul className="flex space-x-2">
                {pages.map((page) => (
                    <li key={page.slug}>
                        <NavLink to={`/admin/${page.slug}`}>
                            {page.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}