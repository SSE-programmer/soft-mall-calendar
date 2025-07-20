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
import CurrentTimeIndicator
    from '@/pages/calendar-view/components/calendar-view-week-grid/components/timeline-rows/components/current-time-indicator.vue';
import { computed } from 'vue';

interface Props {
    days: Date[];
}

const props = defineProps<Props>();

const activeColumnIndex = computed(() => props.days.findIndex(day => isToday(day)));
</script>

<template>
    <div class="sm-flex sm-flex-col sm-overflow-y-auto">
        <div
            class="timeline sm-grid sm-overflow-y-auto"
            :style="{
                height: `${parseInt(WEEK_VIEW_TIMELINE_ROW_HEIGH) * HOURS_IN_DAY}px`,
                'min-height': `${parseInt(WEEK_VIEW_TIMELINE_ROW_HEIGH) * HOURS_IN_DAY}px`,
                'grid-template-columns': `${WEEK_VIEW_SIDE_COLUMN_WIDTH} repeat(${ WEEK_LENGTH }, 1fr)`
            }"
        >
            <div
                class="column"
                :style="{
                    'width': WEEK_VIEW_SIDE_COLUMN_WIDTH,
                }"
            >
                <template
                    v-for="(hour, index) in HOURS_IN_DAY - 1"
                    :key="hour"
                >
                    <span
                        v-if="index + 1 !== HOURS_IN_DAY"
                        class="time sm-ultra-light-primary-color sm-overflow-hidden sm-text-12 sm-text-center"
                        :style="{
                            width: WEEK_VIEW_SIDE_COLUMN_WIDTH,
                            top: `${parseInt(WEEK_VIEW_TIMELINE_ROW_HEIGH) * (index + 1)}px`,
                        }"
                    >
                        {{ hour.toString().padStart(2, '0') }}:00
                    </span>
                </template>
            </div>

            <div
                v-for="(day, index) in days"
                :key="day.getTime()"
                class="column"
                :class="{
                    'is-today': isToday(day)
                }"
            ></div>

            <template
                v-for="(hour, index) in HOURS_IN_DAY - 1"
                :key="hour"
            >
                    <span
                        v-if="index + 1 !== HOURS_IN_DAY"
                        class="row-separator"
                        :style="{
                            top: `${parseInt(WEEK_VIEW_TIMELINE_ROW_HEIGH) * (index + 1)}px`,
                            left: WEEK_VIEW_SIDE_COLUMN_WIDTH,
                            right: 0
                        }"
                    ></span>
            </template>

            <current-time-indicator
                v-if="activeColumnIndex !== -1"
                :active-column-index="activeColumnIndex"
            ></current-time-indicator>
        </div>
    </div>
</template>

<style
    scoped
    lang="scss"
>
.timeline {
    position: relative;

    .column {
        position: relative;
        height: 100%;
        min-height: 100%;

        &:not(:last-of-type) {
            border-right: var(--calendar-default-border);
        }

        &.is-today {
            background-color: var(--calendar-today-cell-background-color);
        }
    }

    .row-separator {
        position: absolute;
        height: 1px;
        min-height: 1px;
        max-height: 1px;
        background: var(--calendar-default-border-color);
    }

    .time {
        position: absolute;
        transform: translateY(-50%);
    }
}
</style>
