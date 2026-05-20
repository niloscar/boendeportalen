import FormButton from "./ui/FormButton"
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"

export default function AdminLoginForm() {
    const [fieldData, setFieldData] = useState({
        email: '',
        password: ''
    })
    
    console.log(useAuth())

    const login = (fieldData: { email: string; password: string }) => {
        // Implement your login logic here, e.g., call an API, update context, etc.
        console.log('Logging in with:', fieldData)
        // For example, if you have a login function from your auth library:
        // login(fieldData.email, fieldData.password).then(() => {
        //     // Optionally, you can also redirect to the dashboard page after login
        //     window.location.href = '/admin/dashboard'
        // })
        return true
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFieldData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Handle form submission
        const emailError = validateInput(fieldData.email, emailValidations)
        const passwordError = validateInput(fieldData.password, passwordValidations)

        if (emailError) console.error('Email validation error:', emailError)
        if (passwordError) console.error('Password validation error:', passwordError)

        const loginSuccess = login(fieldData)
        if (loginSuccess) {
            console.log('Form submitted with data:', fieldData)
        }
    }

    const emailValidations = [
        { rule: 'required', message: 'Fältet för mailadress är obligatoriskt' },
        { rule: 'email', message: 'Ange en giltig mailadress', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    ]

    const passwordValidations = [
        { rule: 'required', message: 'Fältet för lösenord är obligatoriskt' },
    ]

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="form-group mb-4">
                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                    Mailadress
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="Mailadress"
                    className="w-full p-3 bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={fieldData.email}
                    onChange={handleChange}
                    autoComplete="email"
                />
            </div>
            <div className="form-group mb-6">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                    Lösenord
                </label>
                <input
                    id="password"
                    type="password"
                    placeholder="Lösenord"
                    className="w-full p-3 bg-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={fieldData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                />
            </div>
            <div className="flex items-center justify-between">
                <FormButton type="submit">
                    Logga in
                </FormButton>
            </div>
        </form>
    );
}

function validateInput(value: string, validations: { rule: string; message: string; pattern?: RegExp }[]): string | null {
    for (const validation of validations) {
        if (validation.rule === 'required' && !value.trim()) {
            return validation.message
        }
        if (validation.rule === 'email' && validation.pattern && !validation.pattern.test(value)) {
            return validation.message
        }
    }
    return null
}