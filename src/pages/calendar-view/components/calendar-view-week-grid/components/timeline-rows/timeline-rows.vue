<script
    setup
    lang="ts"
>
import {
    HOURS_IN_DAY,
    WEEK_LENGTH,
    WEEK_VIEW_SIDE_COLUMN_WIDTH,
    WEEK_VIEW_TIMELINE_ROW_HEIGH
} from '@/pages/calendar-view/constants/calendar.ts';
import { isToday } from 'date-fns';

interface Props {
    days: Date[];
}

const props = defineProps<Props>();
</script>

<template>
    <div class="timeline sm-flex sm-flex-col sm-overflow-y-auto">
        <div
            v-for="(hour, index) in HOURS_IN_DAY"
            :key="hour"
            class="row"
            :style="{
                'grid-template-columns': `${WEEK_VIEW_SIDE_COLUMN_WIDTH} repeat(${ WEEK_LENGTH }, 1fr)`,
            }"
        >
            <div
                class="cell cell__time sm-flex sm-gap-8 sm-items-center sm-justify-center sm-ultra-light-primary-color sm-overflow-hidden sm-text-12"
                :style="{
                    width: WEEK_VIEW_SIDE_COLUMN_WIDTH,
                    'min-width': WEEK_VIEW_SIDE_COLUMN_WIDTH,
                    'max-width': WEEK_VIEW_SIDE_COLUMN_WIDTH,
                    height: WEEK_VIEW_TIMELINE_ROW_HEIGH
                }"
            >
                <span
                    v-if="index + 1 !== HOURS_IN_DAY"
                    class="time"
                >
                    {{ hour.toString().padStart(2, '0') }}:00
                </span>
            </div>
            <div
                v-for="day in days"
                :key="day.getTime()"
                class="cell sm-flex sm-flex-col sm-flex-1"
                :class="{
                    'is-today': isToday(day)
                }"
            >
            </div>
        </div>
    </div>
</template>

<style scoped>
.row {
    display: grid;

    &:not(:last-child) {
        .cell:not(.cell__time) {
            border-bottom: var(--calendar-default-border);
        }
    }

    .cell:not(:last-child) {
        border-right: var(--calendar-default-border);
    }

    .cell.is-today {
        background-color: var(--calendar-today-cell-background-color);
    }

    .cell__time {
        align-items: end;
        overflow: visible;

        .time {
            transform: translateY(0.5em);
        }
    }
}
</style>
