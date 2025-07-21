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
import { getWeek, isAfter, isBefore, isSameDay, isToday } from 'date-fns';
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar/calendar.ts';
import { useCalendarEventsStore } from '@/stores/calendar/calendar-events.ts';
import { computed, ref, toRefs, watch } from 'vue';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';
import FullDayEvent, {
    type IPreparedCalendarEvent
} from '@/pages/calendar-view/components/calendar-view-week-grid/components/full-day-events-row/full-day-event/full-day-event.vue';
import { useCalendarEventDialogStore } from '@/stores/calendar/calendar-event-dialog.ts';

interface Props {
    days: Date[];
}

const props = defineProps<Props>();
const { days } = toRefs(props);
const { selectedDate } = storeToRefs(useCalendarStore());
const calendarEventsStore = useCalendarEventsStore();
const { getEvents } = calendarEventsStore;

const firstDay = computed(() => days.value[0]);
const lastDay = computed(() => days.value[days.value.length - 1]);

const events = ref<ICalendarEvent[]>([]);
const sortedEvents = computed(() => events.value.sort((a, b) => {
    const aDuration = a.calculatedEnd.getTime() - a.calculatedStart.getTime();
    const bDuration = b.calculatedEnd.getTime() - b.calculatedStart.getTime();

    return aDuration - bDuration;
}));

const eventsGrid = computed(() => {
    const result: IPreparedCalendarEvent[][] = [];

    for (const event of sortedEvents.value) {
        const preparedEvent = getPreparedEvent(event);

        if (!result.length) {
            result.push([preparedEvent]);

            continue;
        }

        let foundRow = false;

        for (const row of result) {
            const noIntersection = row.every(item => {
                const preparedItem = getPreparedEvent(item);

                return preparedItem.startColumn < preparedEvent.startColumn && preparedItem.endColumn <= preparedEvent.startColumn ||
                    preparedItem.startColumn >= preparedEvent.endColumn && preparedItem.endColumn > preparedEvent.endColumn;
            });

            if (noIntersection) {
                foundRow = true;
                row.push(preparedEvent);

                break;
            }
        }

        if (!foundRow) {
            result.push([preparedEvent]);
        }
    }

    return result;

    function getPreparedEvent(event: ICalendarEvent): IPreparedCalendarEvent {
        let eventStart = event.calculatedStart;
        let eventEnd = event.calculatedEnd;

        let truncatedBeginning = false;
        let truncatedEnd = false;

        if (isBefore(eventStart, firstDay.value)) {
            eventStart = firstDay.value;
            truncatedBeginning = true;
        }

        if (isAfter(eventEnd, lastDay.value)) {
            eventEnd = lastDay.value;
            truncatedEnd = true;
        }

        const startDayIndex = days.value.findIndex(day => isSameDay(day, eventStart));
        const endDayIndex = days.value.findIndex(day => isSameDay(day, eventEnd));

        return {
            ...event,
            startColumn: startDayIndex,
            endColumn: endDayIndex + 1,
            truncatedBeginning,
            truncatedEnd,
        };
    }
});

const loadEvents = () => {
    if (days.value.length > 0) {
        events.value = getEvents({
            fullDay: true,
            dateStart: firstDay.value,
            dateEnd: lastDay.value
        });
    }
};

loadEvents();

watch(days, () => {
    loadEvents();
}, { deep: true });

calendarEventsStore.$onAction(({ name, after }) => {
    after(() => {
        switch (name) {
            case 'save':
            case 'remove':
                loadEvents();
                break;
        }
    });
});

const { openDialog } = useCalendarEventDialogStore();

function editEvent(event: ICalendarEvent) {
    openDialog(event);
}

function onDayCellClick(date: Date) {
    const { getDefaultCalendarEvent } = calendarEventsStore;
    const eventDraft = getDefaultCalendarEvent();

    openDialog({
        ...eventDraft,
        dateStart: date,
        dateEnd: date,
        fullDay: true
    });
}
</script>

<template>
    <div
        class="row"
        :style="{
            'grid-template-columns': `${WEEK_VIEW_SIDE_COLUMN_WIDTH} repeat(${ WEEK_LENGTH }, 1fr)`,
            'height': `${parseInt(WEEK_VIEW_CELL_PADDING) * 2 + (eventsGrid.length || 1) * parseInt(WEEK_VIEW_FULL_DATE_EVENT_HEIGH) + ((eventsGrid.length || 1) - 1) * parseInt(WEEK_VIEW_FULL_DATE_EVENT_GAP)}px`,
            'min-height': `${parseInt(WEEK_VIEW_CELL_PADDING) * 2 + (eventsGrid.length || 1) * parseInt(WEEK_VIEW_FULL_DATE_EVENT_HEIGH) + ((eventsGrid.length || 1) - 1) * parseInt(WEEK_VIEW_FULL_DATE_EVENT_GAP)}px`
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
            @click="onDayCellClick(day)"
        ></div>

        <template
            v-for="(row, rowIndex) in eventsGrid"
            :key="rowIndex"
        >
            <full-day-event
                v-for="event in row"
                :event="event"
                :row-index="rowIndex"
                @click="editEvent(event)"
                @keydown.enter="editEvent(event)"
                tabindex="0"
            ></full-day-event>
        </template>
    </div>
</template>

<style scoped>
.row {
    position: relative;
    display: grid;
    border-top: var(--calendar-default-border);
    border-bottom: var(--calendar-default-border);

    .cell:not(:last-of-type) {
        border-right: var(--calendar-default-border);
    }

    .cell.is-today {
        background-color: var(--calendar-today-cell-background-color);
    }
}
</style>
