import { useEffect } from "react";
import type { AlertDialogProps } from "../../types/ui";

export default function AlertDialog({
    open,
    title = "Är du säker?",
    message = "Vill du verkligen fortsätta?",
    onConfirm,
    confirmColor
}: AlertDialogProps) {

    const colorMap = {
        green: "bg-green-500 hover:bg-green-700",
        red: "bg-red-500 hover:bg-red-700"
    };

    // Close dialog with escape key
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") onConfirm();
        }
        if (open) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onConfirm]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onConfirm}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-[fadeIn_0.15s_ease-out]">
                <h2 className="text-xl text-neutral-900 font-semibold mb-2">{title}</h2>
                <p className="whitespace-pre-line text-gray-700 mb-6">{message}</p>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-xl text-white transition ${colorMap[confirmColor]}`}>
                        OK
                    </button>
                </div>
            </div>
        </div >
    );
}