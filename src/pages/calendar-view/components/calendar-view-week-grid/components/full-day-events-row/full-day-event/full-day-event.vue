<script
    setup
    lang="ts"
>
import {
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
    cellWidth: number;
}

const props = defineProps<Props>();
</script>

<template>
    <div
        class="calendar-event sm-flex sm-gap-4 sm-items-center sm-bg-middle-background sm-p-4 sm-border-radius-6 sm-light-accent-color sm-text-12"
        :style="{
            top: `${parseInt(WEEK_VIEW_CELL_PADDING) + rowIndex * parseInt(WEEK_VIEW_FULL_DATE_EVENT_HEIGH) + rowIndex * parseInt(WEEK_VIEW_FULL_DATE_EVENT_GAP)}px`,
            left: `${parseInt(WEEK_VIEW_CELL_PADDING) + parseInt(WEEK_VIEW_SIDE_COLUMN_WIDTH) + cellWidth * event.startColumn}px`,
            width: `${cellWidth * (event.endColumn - event.startColumn) - parseInt(WEEK_VIEW_CELL_PADDING)}px`,
            height: WEEK_VIEW_FULL_DATE_EVENT_HEIGH,
        }"
        v-tooltip.bottom="`${format(event.dateStart, 'dd.mm.yy')} - ${format(event.dateEnd, 'dd.mm.yy')}\n${event.name}\n${event.description ? '[' + event.description + ']' : ''}`"
    >
        <span
            v-if="event.truncatedBeginning"
            class=""
        >
            From {{format(event.dateStart, 'dd.mm.yy')}}
        </span>
         <span class="sm-font-bold">{{ event.name }}</span>
    </div>
</template>

<style scoped>
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
