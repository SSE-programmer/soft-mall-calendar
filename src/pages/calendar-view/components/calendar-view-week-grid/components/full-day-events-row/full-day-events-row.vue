<script
    setup
    lang="ts"
>
import { WEEK_VIEW_SIDE_COLUMN_WIDTH } from '@/shared/constants/calendar.ts';
import { getWeek } from 'date-fns';

interface Props {
    days: Date[];
}

const props = defineProps<Props>();
</script>

<template>
    <div class="row sm-flex">
        <div
            class="cell sm-flex sm-gap-8 sm-items-center sm-justify-center sm-p-8 sm-ultra-light-primary-color sm-overflow-hidden sm-text-12"
            :style="{
                width: WEEK_VIEW_SIDE_COLUMN_WIDTH,
                'min-width': WEEK_VIEW_SIDE_COLUMN_WIDTH,
                'max-width': WEEK_VIEW_SIDE_COLUMN_WIDTH
            }"
        >
            {{ getWeek(new Date()) }} week
        </div>
        <div
            v-for="day in days"
            :key="day.getTime()"
            class="cell sm-flex sm-flex-col sm-flex-1"
        >
        </div>
    </div>
</template>

<style scoped>
    .row {
        border-top: var(--calendar-default-border);
        border-bottom: var(--calendar-default-border);

        .cell:not(:last-child) {
            border-right: var(--calendar-default-border);
        }
    }
</style>
