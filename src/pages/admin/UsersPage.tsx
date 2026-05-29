import axios from 'axios'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { deleteUser, getUsers, updateUser } from '../../api/usersApi'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { FloppyDiskIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'

import type { ReactNode } from 'react'
import type { Profile } from '../../types/profile'

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

    const [userToDelete, setUserToDelete] = useState<Profile | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [deletingUserId, setDeletingUserId] = useState<Profile['id'] | null>(null)

    const fullNameInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const usersData = await getUsers()
                setUsers(usersData)
            } catch {
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

        setSaveError(null)
        setDeleteError(null)
        setEditingUserId(user.id)
        setEditedUser({ ...user })
    }

    const handleCancelEditUser = () => {
        setSaveError(null)
        setDeleteError(null)
        setEditingUserId(null)
        setEditedUser(null)
    }

    const getEditableRole = (role: Profile['role']): EditableRole => (
        role === 'admin' ? 'admin' : 'user'
    )

    const getRoleLabel = (role: Profile['role']) => (
        role === 'admin' ? 'Admin' : 'Användare'
    )

    // Preserve tenant/staff roles when the UI value is "user".
    // Only explicitly change role when promoting to admin or demoting from admin.
    const getRoleForSave = (
        originalRole: Profile['role'],
        editedRole: Profile['role']
    ): Profile['role'] => {
        if (editedRole === 'admin') return 'admin'
        if (originalRole === 'admin') return 'user'

        return originalRole
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
        setSaveError(null)
        setDeleteError(null)

        if (!editedUser?.id) return

        if (!editedUser.full_name?.trim()) {
            setSaveError('Fältet för namn kan inte lämnas tomt.')
            fullNameInputRef.current?.focus()
            return
        }

        const originalUser = users.find(user => user.id === editedUser.id)

        if (!originalUser) return

        if (!hasUserChanged(originalUser, editedUser)) {
            handleCancelEditUser()
            return
        }

        setSavingUserId(editedUser.id)

        try {
            const updatedUser = await updateUser(editedUser.id, {
                full_name: editedUser.full_name.trim(),
                phone: editedUser.phone,
                email: editedUser.email,
                role: getRoleForSave(originalUser.role, editedUser.role),
            })

            setUsers(users.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            ))

            handleCancelEditUser()
        } catch {
            setSaveError('Kunde inte spara ändringarna. Försök igen.')
        } finally {
            setSavingUserId(null)
        }
    }

    const handleOpenDeleteDialog = (user: Profile) => {
        setUserToDelete(user)
    }

    const handleCloseDeleteDialog = () => {
        setUserToDelete(null)
    }

    const handleDeleteUser = async () => {
        setSaveError(null)
        setDeleteError(null)

        if (!userToDelete?.id) return

        setDeletingUserId(userToDelete.id)

        try {
            await deleteUser(userToDelete.id)

            if (editingUserId === userToDelete.id) {
                handleCancelEditUser()
            }

            setUsers(users.filter(user => user.id !== userToDelete.id))
            setUserToDelete(null)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setDeleteError('Användaren kan inte tas bort eftersom den är kopplad till ett kontrakt.')
                return
            }

            setDeleteError('Kunde inte ta bort användaren. Försök igen.')
        } finally {
            setDeletingUserId(null)
            setUserToDelete(null)
        }
    }

    if (loading) return <p className="text-sm text-neutral-600 text-center w-full">Laddar inställningar...</p>
    if (loadError) return <p className="text-red-600 text-center w-full">Kunde inte ladda inställningar: {loadError}</p>

    return (
        <div className="py-6 border-t border-neutral-200 bg-white rounded-xl p-6 shadow-md overflow-x-auto">

            {(saveError || deleteError) && (
                <p className="my-4 text-red-600 text-center w-full">
                    {saveError ?? deleteError}
                </p>
            )}

            <table className="md:table-fixed w-full text-left border-collapse">
                <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                    <col className="w-20" />
                </colgroup>

                <thead className="text-sm">
                <tr>
                    <th className="pr-2 py-1">Namn</th>
                    <th className="px-2 py-1">Telefon</th>
                    <th className="px-2 py-1">Email</th>
                    <th className="px-2 py-1">Roll</th>
                    <th className="pl-2 py-1"></th>
                </tr>
                </thead>

                <tbody className="text-sm text-neutral-600">
                    {users.map(user => {
                        const isEditing = editingUserId === user.id
                        const isSaving = savingUserId === user.id
                        const isDeleting = deletingUserId === user.id
                        const currentUser = isEditing && editedUser ? editedUser : user

                        return (
                            <tr key={user.id} className="hover:text-neutral-900">
                                <td className="pr-2">
                                    <ToggleableInput
                                        ref={isEditing ? fullNameInputRef : undefined}
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

                                <td className="pl-2 whitespace-nowrap">
                                      <button
                                        type="button"
                                        disabled={!isEditing || isSaving || isDeleting}
                                        onClick={() => handleOpenDeleteDialog(user)}
                                        aria-hidden={!isEditing}
                                        tabIndex={isEditing ? 0 : -1}
                                        className={`mr-2 text-red-700 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        isEditing ? 'cursor-pointer' : 'invisible'
                                        }`}
                                    >
                                        <TrashIcon size={20} />
                                    </button>

                                    <button
                                        type="button"
                                        disabled={isSaving || isDeleting}
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

            {userToDelete && (
                <ConfirmDialog
                    open={!!userToDelete}
                    title="Ta bort användare?"
                    message={`Är du säker på att du vill ta bort ${userToDelete.full_name ?? 'den här användaren'}?`}
                    isProcessing={deletingUserId === userToDelete.id}
                    onConfirm={handleDeleteUser}
                    onCancel={handleCloseDeleteDialog}
                    confirmColor="red"
                />
            )}

        </div>
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

const ToggleableInput = forwardRef<HTMLInputElement, ToggleableInputProps>(function ToggleableInput({
    id,
    name,
    value,
    isEditing,
    onChange,
    displayValue,
    type = 'text'
}, ref) {
    return (
        <div className="h-9 flex items-center">
            {isEditing ? (
                <input
                    ref={ref}
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
})

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