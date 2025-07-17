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

export interface IPreparedCalendarEvent extends ICalendarEvent {
    startColumn: number;
    endColumn: number;
}

interface Props {
    event: IPreparedCalendarEvent;
    rowIndex: number;
    cellWidth: number;
}

const props = defineProps<Props>();
</script>

<template>
    <span
        class="calendar-event sm-flex sm-gap-4 sm-items-center sm-bg-middle-background sm-p-4 sm-border-radius-6 sm-light-accent-color sm-text-12"
        :style="{
                    top: `${parseInt(WEEK_VIEW_CELL_PADDING) + rowIndex * parseInt(WEEK_VIEW_FULL_DATE_EVENT_HEIGH) + rowIndex * parseInt(WEEK_VIEW_FULL_DATE_EVENT_GAP)}px`,
                    left: `${parseInt(WEEK_VIEW_CELL_PADDING) + parseInt(WEEK_VIEW_SIDE_COLUMN_WIDTH) + cellWidth * event.startColumn}px`,
                    width: `${cellWidth * (event.endColumn - event.startColumn) - parseInt(WEEK_VIEW_CELL_PADDING)}px`,
                    height: WEEK_VIEW_FULL_DATE_EVENT_HEIGH,
                }"
    >{{ event.name }}</span>
</template>

<style scoped>
    .calendar-event {
        position: absolute;
        transition: .1s width;
    }
</style>
