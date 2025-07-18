<script
    setup
    lang="ts"
>
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar/calendar.ts';
import { computed } from 'vue';
import { addDays, startOfWeek, } from 'date-fns';
import { WEEK_LENGTH, WEEK_START } from '@/pages/calendar-view/constants/calendar.ts';
import GridHeader from '@/pages/calendar-view/components/calendar-view-week-grid/components/grid-header/grid-header.vue';
import FullDayEventsRow from '@/pages/calendar-view/components/calendar-view-week-grid/components/full-day-events-row/full-day-events-row.vue';
import TimelineRows
    from '@/pages/calendar-view/components/calendar-view-week-grid/components/timeline-rows/timeline-rows.vue';
import { useCalendarEventsStore } from '@/stores/calendar/calendar-events.ts';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';

const { selectedDate } = storeToRefs(useCalendarStore());

const days = computed<Date[]>(() => {
    const weekStart = startOfWeek(selectedDate.value, { weekStartsOn: WEEK_START });

    return Array.from({ length: WEEK_LENGTH }).map((_, index) => addDays(weekStart, index));
});

const calendarEventsStore = useCalendarEventsStore();
const calendarStore = useCalendarStore();

calendarEventsStore.$onAction(({name, args }) => {
    if (name === 'save') {
        setActualSelectedDate(args[0]);
    }
});

function setActualSelectedDate(event: ICalendarEvent) {
    if (event.calculatedStart < days.value[0] || event.calculatedEnd > days.value[days.value.length - 1]) {
        calendarStore.setSelectedDate(event.calculatedStart);
    }
};
</script>

<template>
    <div class="sm-flex sm-flex-col sm-max-h-full sm-overflow-hidden">
        <grid-header class="sm-mb-8" :days="days"></grid-header>
        <full-day-events-row :days="days"></full-day-events-row>
        <timeline-rows :days="days"></timeline-rows>
    </div>
</template>

<style scoped>
</style>
