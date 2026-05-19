import { useEffect } from "react";

export default function ConfirmDialog({
    open,
    title = "Är du säker?",
    message = "Vill du verkligen fortsätta?",
    onConfirm,
    onCancel,
    confirmColor
}: {
    open: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor: "green" | "red";
}) {

    const colorMap = {
        green: "bg-green-500 hover:bg-green-700",
        red: "bg-red-500 hover:bg-red-700"
    };

    // Close dialog with escape key
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") onCancel();
        }
        if (open) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-[fadeIn_0.15s_ease-out]">
                <h2 className="text-xl text-neutral-900 font-semibold mb-2">{title}</h2>
                <p className="whitespace-pre-line text-gray-700 mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="text-gray-700 px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100 transition">
                        Avbryt
                    </button>

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