import { defineStore } from 'pinia';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';
import { ref } from 'vue';
import { reviver } from '@/shared/utils';

export const ID = 'calendar-events';

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

    return {
        calendarEvents,
        getDefaultCalendarEvent,
        save
    };
});
