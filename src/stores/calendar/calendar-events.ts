import { defineStore } from 'pinia';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';
import { ref } from 'vue';
import { reviver } from '@/shared/utils';
import { type CalendarEventRangeUnit, getCalendarEventEnd, getCalendarEventStart } from '@/pages/calendar-view/utils';

export const ID = 'calendar-events';

export type CalendarEventsFilter = Partial<ICalendarEvent>;

export const useCalendarEventsStore = defineStore(ID, () => {
    const calendarEvents = ref<ICalendarEvent[]>([]);
    const stateFromLocalStorage = localStorage.getItem(ID);

    if (stateFromLocalStorage) {
        const parsed = JSON.parse(stateFromLocalStorage, reviver);

        if (parsed.calendarEvents) {
            calendarEvents.value = parsed.calendarEvents;
        }
    }

    function getDefaultCalendarEvent(): ICalendarEvent {
        return {
            name: '',
            description: '',
            fullDay: false,
            dateStart: new Date(),
            dateEnd: new Date(),
            timeStart: new Date(),
            timeEnd: new Date()
        };
    }

    function save(event: ICalendarEvent) {
        let id = event.id;

        if (!id) {
            id = new Date().getTime();
            event.id = id;
        }

        const eventByIdIndex = calendarEvents.value.findIndex(item => item.id === id);

        if (eventByIdIndex !== -1) {
            calendarEvents.value.splice(eventByIdIndex, 1, event);
        } else {
            calendarEvents.value.push(event);
        }
    }

    function getEvents(filters?: CalendarEventsFilter) {
        let result: ICalendarEvent[] = [...calendarEvents.value];

        if (!filters) {
            return result;
        }

        const name = filters.name;

        if ((typeof name === 'string') && name.length > 0) {
            result = result.filter((event) => event.name.includes(name));
        }

        const description = filters.description;

        if ((typeof description === 'string') && description.length > 0) {
            result = result.filter((event) => event.description.includes(description));
        }

        const fullDay = filters.fullDay;

        if (fullDay !== undefined) {
            result = result.filter((event) => event.fullDay === fullDay);
        }

        if ('dateStart' in filters && filters.dateStart) {
            const filterStart = getCalendarEventStart(filters as CalendarEventRangeUnit<'dateStart'>);

            result = result.filter((event) => {
                const eventStart = getCalendarEventStart(event);
                const eventEnd = getCalendarEventEnd(event);

                return eventStart >= filterStart || eventEnd >= filterStart;
            });
        }

        if ('dateEnd' in filters && filters.dateEnd) {
            const filterEnd = getCalendarEventEnd(filters as CalendarEventRangeUnit<'dateEnd'>);

            result = result.filter((event) => {
                const eventStart = getCalendarEventStart(event);
                const eventEnd = getCalendarEventEnd(event);

                return eventStart <= filterEnd || eventEnd <= filterEnd;
            });
        }

        return result;
    }

    return {
        calendarEvents,
        getDefaultCalendarEvent,
        save,
        getEvents
    };
});
