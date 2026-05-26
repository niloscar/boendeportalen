import { type FormSwitchProps } from '../../types/ui'

export default function FormSwitch({ 
    id, 
    name, 
    checked, 
    onSwitchChange, 
    disabled }: FormSwitchProps
) {
    return (
        <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={(e) => onSwitchChange(name, e.target.checked)}
                disabled={disabled}
                className="peer sr-only"
            />
            <span 
                className="absolute inset-0 
                rounded-full border border-gray-300 bg-gray-100 
                transition-colors peer-checked:border-green-500 peer-checked:bg-green-500" 
            />
            <span 
                className="absolute left-0.5 h-4 w-4 
                rounded-full bg-white shadow 
                transition-transform peer-checked:translate-x-4" />
        </label>
    )
}