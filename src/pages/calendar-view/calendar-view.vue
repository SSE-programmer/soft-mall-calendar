<script
    setup
    lang="ts"
>
import CalendarViewHeader from '@/pages/calendar-view/components/calendar-view-header/calendar-view-header.vue';
import pButton from 'primevue/button';
import pDatePicker from 'primevue/datepicker';
import CalendarViewGridWeek from '@/pages/calendar-view/components/calendar-view-week-grid/calendar-view-grid-week.vue';
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar/calendar.ts';
import { useCalendarEventDialogStore } from '@/stores/calendar/calendar-event-dialog.ts';
import EditCalendarEventDialog
    from '@/pages/calendar-view/components/edit-calendar-event-dialog/edit-calendar-event-dialog.vue';

const { selectedDate } = storeToRefs(useCalendarStore());
const { openDialog } = useCalendarEventDialogStore();

function createCalendarEvent() {
    openDialog();
}
</script>

<template>
    <div class="calendar-container sm-flex sm-flex sm-flex-1 sm-border-radius-16 sm-overflow-x-auto">
        <aside class="side-menu sm-flex sm-flex-col sm-gap-12 sm-p-16">
            <p-button
                class="sm-w-full"
                @click="createCalendarEvent"
            >
                + Create event
            </p-button>
            <p-date-picker
                class="sm-w-full"
                v-model="selectedDate"
                inline
                showWeek
            />
        </aside>
        <main class="sm-flex sm-flex-col sm-gap-12 sm-flex-1 sm-bg-light-background sm-w-full sm-p-16">
            <calendar-view-header></calendar-view-header>
            <calendar-view-grid-week></calendar-view-grid-week>
        </main>
    </div>

    <edit-calendar-event-dialog></edit-calendar-event-dialog>
</template>

<style scoped>
.calendar-container {
    box-shadow: var(--sm-modals-box-shadow);
}

.side-menu {
    width: 350px;
    max-width: 350px;
    background: rgba(255, 255, 255, 0.23);
    backdrop-filter: blur(5px) opacity(0.1);
}
</style>

<style>
.calendar-container {
    --calendar-default-border: 1px solid var(--sm-gray-middle-color);
    --calendar-default-border-color: var(--sm-gray-middle-color);
    --calendar-today-cell-background-color: var(--sm-gray-light-color);
}
</style>
