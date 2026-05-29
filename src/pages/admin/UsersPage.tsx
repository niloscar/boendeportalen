import { useEffect, useState } from "react"
import { getUsers, updateUser } from "../../api/usersApi"
import { FloppyDiskIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"

import type { ReactNode } from "react"
import type { Profile } from "../../types/profile"

type EditableRole = 'user' | 'admin'
type EditableUserField = 'full_name' | 'phone' | 'email' | 'role'

export default function UsersPage() {
    const [users, setUsers] = useState<Profile[]>([])
    const [loadError, setLoadError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const [editingUserId, setEditingUserId] = useState<Profile['id'] | null>(null)
    const [editedUser, setEditedUser] = useState<Profile | null>(null)

    const [saveError, setSaveError] = useState<string | null>(null)
    const [savingUserId, setSavingUserId] = useState<Profile['id'] | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const usersData = await getUsers()
                setUsers(usersData)
            } catch (error) {
                console.error('Kunde inte hämta användare:', error)
                setLoadError('Kunde inte hämta användare')
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const handleInputChange = (
        field: EditableUserField,
        value: string
    ) => {
        if (!editedUser) return

        setEditedUser({
            ...editedUser,
            [field]: value
        })
    }

    const handleEditUser = (user: Profile) => {
        if (!user.id) return

        setEditingUserId(user.id)
        setEditedUser({ ...user })
    }

    const handleCancelEditUser = () => {
        setEditingUserId(null)
        setEditedUser(null)
    }

    const hasUserChanged = (originalUser: Profile, editedUser: Profile) => {
        return (
            originalUser.full_name !== editedUser.full_name ||
            originalUser.phone !== editedUser.phone ||
            originalUser.email !== editedUser.email ||
            getEditableRole(originalUser.role) !== getEditableRole(editedUser.role)
        )
    }

    const handleSaveUser = async () => {
        if (!editedUser?.id) return

        const originalUser = users.find(user => user.id === editedUser.id)

        if (!originalUser) return

        if (!hasUserChanged(originalUser, editedUser)) {
            handleCancelEditUser()
            return
        }

        setSaveError(null)
        setSavingUserId(editedUser.id)

        try {
            const updatedUser = await updateUser(editedUser.id, {
                full_name: editedUser.full_name,
                phone: editedUser.phone,
                email: editedUser.email,
                role: editedUser.role === 'admin' ? 'admin' : originalUser.role,
            })

            setUsers(users.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            ))

            handleCancelEditUser()
        } catch (error) {
            console.error('Kunde inte spara användare:', error)
            setSaveError('Kunde inte spara ändringarna. Försök igen.')
        } finally {
            setSavingUserId(null)
        }
    }

    const handleDeleteUser = (user: Profile) => {
        if (!user.id) return

        if (editingUserId === user.id) {
            handleCancelEditUser()
        }

        setUsers(users.filter(u => u.id !== user.id))
    }

    const getEditableRole = (role: Profile['role']): EditableRole => (role === 'admin') ? 'admin' : 'user' // All non admin roles are considered 'user' for editing purposes
    const getRoleLabel = (role: Profile['role']) => (role === 'admin') ? 'Admin' : 'Användare' // Same as above but for display purposes

    if (loading) return <p className="text-sm text-neutral-600 text-center w-full">Laddar inställningar...</p>
    if (loadError) return <p className="text-red-600 text-center w-full">Kunde inte ladda inställningar: {loadError}</p>

    return (
        <main className="py-6 border-t border-neutral-200 bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-neutral-900">Hantera användare</h2>

            {saveError && <p className="mt-4 text-red-600 text-center w-full">{saveError}</p>}

            <table className="w-full table-fixed mt-4 text-left border-collapse">
                <colgroup>
                    <col className="w-[32%]" />
                    <col className="w-[17%]" />
                    <col className="w-[32%]" />
                    <col className="w-[19%]" />
                    <col className="w-24" />
                </colgroup>

                <thead>
                    <tr>
                        <th className="px-2 py-1">Namn</th>
                        <th className="px-2 py-1">Telefon</th>
                        <th className="px-2 py-1">Email</th>
                        <th className="px-2 py-1">Roll</th>
                        <th className="px-2 py-1"></th>
                    </tr>
                </thead>

                <tbody className="text-sm text-neutral-600">
                    {users.map(user => {
                        const isEditing = editingUserId === user.id
                        const isSaving = savingUserId === user.id
                        const currentUser = isEditing && editedUser ? editedUser : user

                        return (
                            <tr key={user.id} className="hover:text-neutral-900">
                                <td className="px-2">
                                    <ToggleableInput
                                        id={`full_name-${user.id}`}
                                        name={`full_name-${user.id}`}
                                        value={currentUser.full_name ?? ''}
                                        displayValue={user.full_name ?? ''}
                                        isEditing={isEditing}
                                        onChange={value => handleInputChange('full_name', value)}
                                    />
                                </td>

                                <td className="px-2">
                                    <ToggleableInput
                                        id={`phone-${user.id}`}
                                        name={`phone-${user.id}`}
                                        type="tel"
                                        value={currentUser.phone ?? ''}
                                        displayValue={user.phone ?? ''}
                                        isEditing={isEditing}
                                        onChange={value => handleInputChange('phone', value)}
                                    />
                                </td>

                                <td className="px-2">
                                    <ToggleableInput
                                        id={`email-${user.id}`}
                                        name={`email-${user.id}`}
                                        type="email"
                                        value={currentUser.email ?? ''}
                                        displayValue={user.email ?? ''}
                                        isEditing={isEditing}
                                        onChange={value => handleInputChange('email', value)}
                                    />
                                </td>

                                <td className="px-2">
                                    <ToggleableSelect
                                        id={`role-${user.id}`}
                                        name={`role-${user.id}`}
                                        value={getEditableRole(currentUser.role)}
                                        displayValue={getRoleLabel(user.role)}
                                        isEditing={isEditing}
                                        onChange={value => handleInputChange('role', value)}
                                    />
                                </td>

                                <td className="w-0 px-2 whitespace-nowrap text-right">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={() => handleDeleteUser(user)}
                                            className="cursor-pointer mr-2 text-red-700 hover:text-red-900"
                                        >
                                            <TrashIcon size={20} />
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        disabled={isSaving}
                                        onClick={() => {
                                            if (isSaving) return

                                            if (isEditing) {
                                                handleSaveUser()
                                                return
                                            }

                                            handleEditUser(user)
                                        }}
                                        className={`cursor-pointer ${isEditing ? 'text-green-600 hover:text-green-800' : 'text-neutral-500 hover:text-neutral-900'}`}
                                    >
                                        {isEditing ? <FloppyDiskIcon size={20} /> : <PencilSimpleIcon size={20} />}
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </main>
    )
}

type ToggleableInputProps = {
    id: string
    name: string
    value: string
    isEditing: boolean
    onChange: (value: string) => void
    displayValue?: ReactNode
    type?: 'text' | 'email' | 'tel'
}

function ToggleableInput({
    id,
    name,
    value,
    isEditing,
    onChange,
    displayValue,
    type = 'text'
}: ToggleableInputProps) {
    return (
        <div className="h-9 flex items-center">
            {isEditing ? (
                <input
                    className="block h-8 w-full box-border bg-neutral-100 border 
                        border-neutral-300 rounded px-2 -m-[calc(var(--spacing)*2+1px)]
                        outline-green-500"
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={event => onChange(event.target.value)}
                />
            ) : (
                <span className="block w-full truncate">
                    {displayValue ?? value}
                </span>
            )}
        </div>
    )
}

type ToggleableSelectProps = {
    id: string
    name: string
    value: EditableRole
    isEditing: boolean
    onChange: (value: EditableRole) => void
    displayValue?: ReactNode
}

function ToggleableSelect({
    id,
    name,
    value,
    isEditing,
    onChange,
    displayValue
}: ToggleableSelectProps) {
    return (
        <div className="h-9 flex items-center">
            {isEditing ? (
                <select
                    className="block h-8 w-full box-border bg-neutral-100 border 
                        border-neutral-300 rounded px-1 -m-[calc(var(--spacing)*2+1px)]
                        outline-green-500"
                    id={id}
                    name={name}
                    value={value}
                    onChange={event => onChange(event.target.value as EditableRole)}
                >
                    <option value="user">Användare</option>
                    <option value="admin">Admin</option>
                </select>
            ) : (
                <span className="block w-full truncate">
                    {displayValue ?? value}
                </span>
            )}
        </div>
    )
}