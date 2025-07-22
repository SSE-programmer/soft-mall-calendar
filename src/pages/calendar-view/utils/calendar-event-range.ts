import { combineDateAndTime } from '@/shared/utils/combine-date-and-time.ts';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';

export type CalendarEventRangeUnit<D extends 'dateStart' | 'dateEnd'> =
    Pick<ICalendarEvent, D>
    & Partial<Pick<ICalendarEvent, D extends 'dateStart' ? 'timeStart' : 'timeEnd'>>;

export function getCalendarEventStart(event: CalendarEventRangeUnit<'dateStart'>) {
    if (event.timeStart) {
        return combineDateAndTime(event.dateStart, event.timeStart);
    } else {
        const result = new Date(event.dateStart);

        result.setHours(0, 0, 0, 0);

        return result;
    }
}

export function getCalendarEventEnd(event: CalendarEventRangeUnit<'dateEnd'>) {
    if (event.timeEnd) {
        return combineDateAndTime(event.dateEnd, event.timeEnd);
    } else {
        const result = new Date(event.dateEnd);

        result.setHours(23, 59, 59);

        return result;
    }
}
