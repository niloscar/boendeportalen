import { useMemo } from "react";

export function useCalendarDays(daysForward: number) {
    return useMemo(() => {
        const today = new Date();
        const days: string[] = [];

        for (let i = 0; i <= daysForward; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            days.push(d.toISOString().split("T")[0]);
        }

        return days;
    }, [daysForward]);
}
