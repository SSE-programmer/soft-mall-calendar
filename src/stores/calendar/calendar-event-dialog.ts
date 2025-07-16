import { defineStore } from 'pinia';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';

export const useCalendarEventDialogStore = defineStore('calendar-event-dialog', () => {
    function openDialog(item?: ICalendarEvent): void {}

    function closeDialog(): void {}

    return {
        openDialog,
        closeDialog
    };
});
