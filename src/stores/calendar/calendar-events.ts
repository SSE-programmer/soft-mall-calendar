import { defineStore } from 'pinia';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';

export const useCalendarEventsStore = defineStore('calendar-events', () => {
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

    return {
        getDefaultCalendarEvent
    };
});
