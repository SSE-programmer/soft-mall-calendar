<script
    setup
    lang="ts"
>

import { format, hoursToMinutes } from 'date-fns';
import { WEEK_LENGTH, WEEK_VIEW_SIDE_COLUMN_WIDTH } from '@/pages/calendar-view/constants/calendar.ts';
import { useCurrentTime } from '@/shared/utils/use-current-time.ts';
import {
    getTopPositionByTime
} from '@/pages/calendar-view/components/calendar-view-week-grid/components/timeline-rows/utils/get-top-position-by-time.ts';

interface Props {
    activeColumnIndex: number;
}

const props = defineProps<Props>();

const { currentTime } = useCurrentTime();

const calculateColumnWidth = () => `calc((100% - ${WEEK_VIEW_SIDE_COLUMN_WIDTH}) / ${WEEK_LENGTH})`;
</script>

<template>
    <div
        class="time-indicator sm-flex sm-items-center"
        :style="{
            top: getTopPositionByTime(currentTime)
        }"
    >
        <span
            class="time-indicator__value sm-text-12 sm-error-color sm-text-center"
            :style="{
                width: `${parseInt(WEEK_VIEW_SIDE_COLUMN_WIDTH) - 1}px`,
                'min-width': WEEK_VIEW_SIDE_COLUMN_WIDTH
            }"
        >
            {{ format(currentTime, 'HH:mm') }}
        </span>
        <span
            class="line sm-error-background"
            :style="{
                width: `calc(${calculateColumnWidth()} * ${activeColumnIndex})`,
                'min-width': `calc(${calculateColumnWidth()} * ${activeColumnIndex})`,
            }"
        ></span>
        <span
            class="line--bold sm-text-12 sm-error-background"
            :style="{
                width: calculateColumnWidth(),
                'min-width': calculateColumnWidth()
            }"
        ></span>
    </div>
</template>

<style
    scoped
    lang="scss"
>
.time-indicator {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 20;
    transform: translateY(-50%);

    user-select: none;
    pointer-events: none;

    &__value {
        background-color: var(--sm-bg-light-color);
        box-shadow: -3px 0 10px 2px var(--sm-bg-light-color);
    }
}

.line {
    height: 1px;
}

.line--bold {
    position: relative;
    height: 2px;

    &:before {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(-50%, -50%);

        content: '';
        width: 10px;
        min-width: 10px;
        height: 10px;
        background-color: var(--sm-error-color);
        border-radius: 50%;
    }
}
</style>
