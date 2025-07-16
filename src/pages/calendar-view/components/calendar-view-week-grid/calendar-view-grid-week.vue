<script
    setup
    lang="ts"
>
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar.ts';
import { computed } from 'vue';
import { addDays, startOfWeek, } from 'date-fns';
import { WEEK_LENGTH, WEEK_START } from '@/shared/constants/calendar.ts';
import GridHeader from '@/pages/calendar-view/components/calendar-view-week-grid/components/grid-header/grid-header.vue';
import FullDayEventsRow from '@/pages/calendar-view/components/calendar-view-week-grid/components/full-day-events-row/full-day-events-row.vue';

const { selectedDate } = storeToRefs(useCalendarStore());

const days = computed<Date[]>(() => {
    const weekStart = startOfWeek(selectedDate.value, { weekStartsOn: WEEK_START });

    return Array.from({ length: WEEK_LENGTH }).map((_, index) => addDays(weekStart, index));
});
</script>

<template>
    <div class="sm-flex sm-flex-col sm-max-h-full">
        <grid-header class="sm-mb-8" :days="days"></grid-header>
        <full-day-events-row :days="days"></full-day-events-row>
    </div>
</template>

<style scoped>
</style>
