<script
    setup
    lang="ts"
>
import {
    WEEK_LENGTH,
    WEEK_VIEW_CELL_PADDING,
    WEEK_VIEW_FULL_DATE_EVENT_GAP,
    WEEK_VIEW_FULL_DATE_EVENT_HEIGH,
    WEEK_VIEW_SIDE_COLUMN_WIDTH
} from '@/pages/calendar-view/constants/calendar.ts';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';
import { format } from 'date-fns';

export interface IPreparedCalendarEvent extends ICalendarEvent {
    startColumn: number;
    endColumn: number;
    truncatedBeginning: boolean;
    truncatedEnd: boolean;
}

interface Props {
    event: IPreparedCalendarEvent;
    rowIndex: number;
}

const props = defineProps<Props>();

const calculateLeftPosition = (startColumn: number) => {
    const staticOffset = parseInt(WEEK_VIEW_CELL_PADDING) + parseInt(WEEK_VIEW_SIDE_COLUMN_WIDTH);

    return `calc(${staticOffset}px + (100% - ${staticOffset}px) / ${WEEK_LENGTH} * ${startColumn})`;
};

const calculateWidth = (startColumn: number, endColumn: number) => {
    const staticOffset = parseInt(WEEK_VIEW_CELL_PADDING) + parseInt(WEEK_VIEW_SIDE_COLUMN_WIDTH);

    return `calc((100% - ${staticOffset}px) / ${WEEK_LENGTH} * ${endColumn - startColumn} - ${WEEK_VIEW_CELL_PADDING})`;
};
</script>

<template>
    <span
        class="calendar-event sm-flex sm-gap-4 sm-items-center sm-bg-middle-background sm-p-4 sm-border-radius-6 sm-light-accent-color sm-text-12"
        :style="{
            top: `${parseInt(WEEK_VIEW_CELL_PADDING) + rowIndex * parseInt(WEEK_VIEW_FULL_DATE_EVENT_HEIGH) + rowIndex * parseInt(WEEK_VIEW_FULL_DATE_EVENT_GAP)}px`,
            left: calculateLeftPosition(event.startColumn),
            width: calculateWidth(event.startColumn, event.endColumn),
            height: WEEK_VIEW_FULL_DATE_EVENT_HEIGH,
        }"
        v-tooltip.bottom="`${format(event.dateStart, 'dd.mm.yy')} - ${format(event.dateEnd, 'dd.mm.yy')}\n${event.name}\n${event.description ? '[' + event.description + ']' : ''}`"
    >
        <span v-if="event.truncatedBeginning">
            From {{ format(event.dateStart, 'dd.mm.yy') }}
        </span>
        <span class="sm-font-bold">{{ event.name }}</span>
    </span>
</template>

<style
    scoped
    lang="scss"
>
.calendar-event {
    position: absolute;
    transition: .1s width;
    white-space: nowrap;
    text-wrap: nowrap;
    overflow: hidden;
    cursor: pointer;

    &:hover {
        background-color: var(--sm-bg-primary-color);
    }
}
</style>
