<script
    setup
    lang="ts"
>
import { WEEK_LENGTH, WEEK_VIEW_SIDE_COLUMN_WIDTH } from '@/shared/constants/calendar.ts';
import { getWeek, isToday } from 'date-fns';
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar/calendar.ts';

interface Props {
    days: Date[];
}

const { selectedDate } = storeToRefs(useCalendarStore());
const props = defineProps<Props>();
</script>

<template>
    <div
        class="row"
        :style="{
            'grid-template-columns': `${WEEK_VIEW_SIDE_COLUMN_WIDTH} repeat(${ WEEK_LENGTH }, 1fr)`
        }"
    >
        <div
            class="cell sm-flex sm-gap-8 sm-items-center sm-justify-center sm-p-8 sm-ultra-light-primary-color sm-overflow-hidden sm-text-12"
            :style="{
                width: WEEK_VIEW_SIDE_COLUMN_WIDTH,
                'min-width': WEEK_VIEW_SIDE_COLUMN_WIDTH,
                'max-width': WEEK_VIEW_SIDE_COLUMN_WIDTH
            }"
        >
            {{ getWeek(selectedDate) }} week
        </div>
        <div
            v-for="day in days"
            :key="day.getTime()"
            class="cell sm-flex sm-flex-col sm-flex-1"
            :class="{
                'is-today': isToday(day)
            }"
        ></div>
    </div>
</template>

<style scoped>
.row {
    display: grid;
    border-top: var(--calendar-default-border);
    border-bottom: var(--calendar-default-border);

    .cell:not(:last-child) {
        border-right: var(--calendar-default-border);
    }

    .cell.is-today {
        background-color: var(--calendar-today-cell-background-color);
    }
}
</style>
