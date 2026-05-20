export type Props = {
    onClose: () => void
}

export type LoginProps = {
    onSwitchToRegister: () => void
    onForgotPassword?: () => void
}

export type RegisterProps = {
    onSwitchToLogin: () => void
}