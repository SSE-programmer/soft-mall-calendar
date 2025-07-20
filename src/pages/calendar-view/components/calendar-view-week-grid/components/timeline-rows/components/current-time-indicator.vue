<script
    setup
    lang="ts"
>

import { format, hoursToMinutes } from 'date-fns';
import { WEEK_LENGTH, WEEK_VIEW_SIDE_COLUMN_WIDTH } from '@/pages/calendar-view/constants/calendar.ts';
import { useCurrentTime } from '@/shared/utils/use-current-time.ts';

interface Props {
    activeColumnIndex: number;
}

const props = defineProps<Props>();

const { currentTime } = useCurrentTime();

const calculateColumnWidth = () => `calc((100% - ${WEEK_VIEW_SIDE_COLUMN_WIDTH}) / ${WEEK_LENGTH})`;

const MINUTES_IN_DAY = 24 * 60;
const calculateIndicatorTopPosition = () => {
    const hours = currentTime.value.getHours();
    const minutes = currentTime.value.getMinutes();
    const totalMinutes = hoursToMinutes(hours) + minutes;

    return `${totalMinutes / MINUTES_IN_DAY * 100}%`;
};
</script>

<template>
    <div
        class="time-indicator sm-flex sm-items-center"
        :style="{
            top: calculateIndicatorTopPosition()
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
                width: `${parseInt(calculateColumnWidth()) * activeColumnIndex}px`,
                'min-width': `${parseInt(calculateColumnWidth()) * activeColumnIndex}px`,
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

    user-select: none;
    pointer-events: none;

    &__value {
        background-color: var(--sm-bg-light-color);
        box-shadow: -3px 0 10px 2px var(--sm-bg-light-color);
    }
}

.line {
    width: 100%;
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
