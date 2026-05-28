import { useEffect, useState } from 'react'
import { getIssues } from '../../../api/issuesApi'

import type { Issue } from '../../../types/issues'

export default function Issues() {
    const [issues, setIssues] = useState<Issue[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedIssues, setExpandedIssues] = useState<number[]>([])

    useEffect(() => {
        async function fetchIssues() {
            try {
                const data = await getIssues()
                setIssues(data)
            } catch (error) {
                console.error('Error fetching issues:', error)
                setError('Kunde inte ladda ärenden')
            } finally {
                setLoading(false)
            }
        }

        fetchIssues()
    }, [])

    const handleToggleDetails = (issueId: number) => {
        setExpandedIssues((prev) => (
            prev.includes(issueId) ? prev.filter(id => id !== issueId) : [...prev, issueId]
        ))
    }

    const ucFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
    const isOpen = (issueId: number) => expandedIssues.includes(issueId)

    if (loading) return <p className="text-sm text-neutral-600 text-center w-full">Laddar ärenden...</p>
    if (error) return <p className="text-sm text-red-600 bg-red-100 rounded-xl px-4 py-3">{error}</p>
    if (issues.length === 0) return (<p className="text-gray-500 text-center w-full italic text-sm">Inga öppna ärenden</p>)

    return (
        <>
            <ul className="divide-y divide-gray-300 mt-6">

                {issues.map((issue) => (
                    <li key={issue.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-end gap-2">
                            
                            <span className="text-xs text-gray-500 mr-auto">{new Date(issue.created_at).toLocaleString()}</span>
                            <span className="font-medium text-xs bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full">
                                {issue.category}
                            </span>
                            <span className="font-medium text-xs bg-red-50 text-red-800 px-2 py-1 rounded-full">
                                {ucFirst(issue.status)}
                            </span>
                            
                        </div>
                        <button 
                            className="text-sm font-bold text-gray-900 text-left hover:underline focus:outline-none" 
                            onClick={() => handleToggleDetails(issue.id)}
                            aria-expanded={isOpen(issue.id)}
                            aria-controls={`issue-details-${issue.id}`}
                        >
                            {`${issue.street} ${issue.house_number}${issue.stairwell ? issue.stairwell : ''}, lgh ${issue.apartment_number}`}
                        </button>

                        {isOpen(issue.id) && (
                            <div id={`issue-details-${issue.id}`} className="text-sm text-gray-600 flex flex-col gap-3">
                                <p>{issue.description}</p>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="font-medium pr-2">Kategori:</td>
                                            <td>{issue.category}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-2">Plats:</td>
                                            <td>{issue.location}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-2">Status:</td>
                                            <td>{ucFirst(issue.status)}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-2">Inkommen:</td>
                                            <td>{new Date(issue.created_at).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-2">Ärendenr:</td>
                                            <td>{issue.id}</td>
                                        </tr>
                                        {issue.updated_at !== issue.created_at && (
                                            <tr>
                                                <td className="font-medium pr-2">Uppdaterad:</td>
                                                <td>{new Date(issue.updated_at).toLocaleString()}</td>
                                            </tr>
                                        )}
                                        </tbody>
                                        <tbody className="before:block before:h-3">
                                        <tr>
                                            <td className="font-medium pr-2">Hyresgäst:</td>
                                            <td>{issue.tenant_name}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium pr-2">Telefon:</td>
                                            <td>{issue.tenant_phone}</td>
                                        </tr>
                                        {issue.has_pet && (
                                            <tr>
                                                <td className="font-medium pr-2">Har husdjur:</td>
                                                <td>Ja</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </>
    )
}