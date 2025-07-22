<script
    setup
    lang="ts"
>
import type {
    IPreparedCalendarEvent
} from '@/pages/calendar-view/components/calendar-view-week-grid/components/timeline-rows/utils/use-prepared-events.ts';
import { format } from 'date-fns';

interface Props {
    preparedEvent: IPreparedCalendarEvent;
}

const props = defineProps<Props>();
</script>

<template>
    <span
        class="calendar-event sm-flex sm-gap-4 sm-items-center sm-justify-center sm-bg-middle-background sm-p-4 sm-border-radius-6 sm-light-accent-color sm-text-12"
        :style="{
            top: preparedEvent.position.top,
            right: preparedEvent.position.right,
            bottom: preparedEvent.position.bottom,
            left: preparedEvent.position.left,
        }"
        v-tooltip.center="`${format(preparedEvent.calculatedStart, 'dd.mm.yy HH:mm')} - ${format(preparedEvent.calculatedEnd, 'dd.mm.yy HH:mm')}\n${preparedEvent.name}\n${preparedEvent.description ? '[' + preparedEvent.description + ']' : ''}`"
    >
        <span class="sm-font-bold">{{ preparedEvent.name }}</span>
    </span>
</template>

<style
    lang="scss"
    scoped
>
.calendar-event {
    position: absolute;
    z-index: 10;
    transition: .1s width;
    white-space: nowrap;
    text-wrap: nowrap;
    overflow: hidden;
    cursor: pointer;
    filter: opacity(.8);

    &:hover {
        filter: opacity(.9);
    }
}
</style>
