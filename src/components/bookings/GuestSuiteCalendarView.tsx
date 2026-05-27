import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import svLocale from "@fullcalendar/core/locales/sv";
import type { GuestSuiteCalendarPropsBig } from "../../types/booking";

export default function GuestSuiteCalendarView({
    calendarRef,
    calendarEvents,
    today,
    isMobile,
    calMaxDate,
    handleEventClick,
    handleViewDidMount
}: GuestSuiteCalendarPropsBig) {
    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                ref={calendarRef}
                headerToolbar={{
                    left: "today",
                    center: "title",
                    right: "prev,next"
                }}
                datesSet={() => {
                    const api = calendarRef.current?.getApi();
                    if (!api) return;

                    const desiredView = isMobile ? "listWeek" : "dayGridMonth";

                    if (api.view.type !== desiredView) {
                        api.changeView(desiredView);
                    }
                }}
                events={calendarEvents}
                eventClassNames={(arg) => {
                    const { isOwner, isAvailable } = arg.event.extendedProps;

                    if (isAvailable) {
                        return "!bg-neutral-200 hover:!bg-green-300 transition duration-200 !border-0 !rounded-sm p-6 !text-gray-700 !cursor-pointer !h-full flex items-center px-2";
                    }

                    if (isOwner) {
                        return "!bg-green-500 hover:!bg-green-700 transition duration-200 !border-0 !rounded-sm p-6 !text-white !cursor-pointer !h-full flex items-center px-2";
                    }

                    return "!bg-neutral-100 !border-0 !rounded-sm p-6 !text-neutral-100 !pointer-events-none !h-full flex items-center px-2";
                }}
                eventContent={(arg) => {
                    const { isAvailable, isOwner } = arg.event.extendedProps;

                    let textColor = "text-gray-700";
                    if (isOwner) textColor = "text-white cursor-pointer";
                    if (!isAvailable && !isOwner) textColor = "text-neutral-500";

                    return {
                        html: `<div class="w-full ${textColor}">${arg.event.title}</div>`
                    };
                }}
                eventClick={handleEventClick}
                firstDay={1}
                locale={svLocale}
                allDaySlot={true}
                height="auto"
                expandRows={true}
                validRange={{
                    start: today.toISOString().split("T")[0],
                    end: calMaxDate.toISOString().split("T")[0]
                }}
                viewDidMount={handleViewDidMount}
            />
        </div>
    );
}