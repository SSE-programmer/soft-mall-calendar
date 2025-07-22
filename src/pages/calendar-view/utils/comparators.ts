import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';

export function eventDurationComparator(a: ICalendarEvent, b: ICalendarEvent) {
    const aDuration = a.calculatedEnd.getTime() - a.calculatedStart.getTime();
    const bDuration = b.calculatedEnd.getTime() - b.calculatedStart.getTime();

    return aDuration - bDuration;
}
