<script
    setup
    lang="ts"
>
import {
    WEEK_LENGTH, WEEK_VIEW_FULL_DATE_EVENT_GAP,
    WEEK_VIEW_FULL_DATE_EVENT_HEIGH,
    WEEK_VIEW_SIDE_COLUMN_WIDTH
} from '@/pages/calendar-view/constants/calendar.ts';
import { getWeek, isToday, isBefore, isAfter, isSameDay } from 'date-fns';
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar/calendar.ts';
import { useCalendarEventsStore } from '@/stores/calendar/calendar-events.ts';
import { computed, ref, toRefs, watch } from 'vue';
import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';
import { getCalendarEventEnd, getCalendarEventStart } from '@/pages/calendar-view/utils';
import { useElementSize } from '@/shared/utils/use-element-size.ts';

interface IPreparedCalendarEvent extends ICalendarEvent {
    startColumn: number;
    endColumn: number;
}

interface Props {
    days: Date[];
}

const props = defineProps<Props>();
const { days } = toRefs(props);
const { selectedDate } = storeToRefs(useCalendarStore());
const { getEvents } = useCalendarEventsStore();

const firstDay = computed(() => days.value[0]);
const lastDay = computed(() => days.value[days.value.length - 1]);

const events = ref<ICalendarEvent[]>([]);
const sortedEvents = computed(() => events.value.sort((a, b) => {
    const aStart = getCalendarEventStart(a);
    const aEnd = getCalendarEventEnd(a);
    const aDuration = aEnd.getTime() - aStart.getTime();

    const bStart = getCalendarEventStart(b);
    const bEnd = getCalendarEventEnd(b);
    const bDuration = bEnd.getTime() - bStart.getTime();

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
        let eventStart = getCalendarEventStart(event);
        let eventEnd = getCalendarEventEnd(event);

        if (isBefore(eventStart, firstDay.value)) {
            eventStart = firstDay.value;
        }

        if (isAfter(eventEnd, lastDay.value)) {
            eventEnd = lastDay.value;
        }

        const startDayIndex = days.value.findIndex(day => isSameDay(day, eventStart));
        const endDayIndex = days.value.findIndex(day => isSameDay(day, eventEnd));

        console.log(eventEnd, lastDay.value);

        return {
            ...event,
            startColumn: startDayIndex,
            endColumn: endDayIndex + 1,
        }
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

const cellElement = ref<HTMLElement | null>(null);
const { width } = useElementSize(cellElement);
</script>

<template>
    <div
        class="row"
        :style="{
            'grid-template-columns': `${WEEK_VIEW_SIDE_COLUMN_WIDTH} repeat(${ WEEK_LENGTH }, 1fr)`,
            'height': `${(eventsGrid.length || 1) * parseInt(WEEK_VIEW_FULL_DATE_EVENT_HEIGH) + ((eventsGrid.length || 1) - 1) * parseInt(WEEK_VIEW_FULL_DATE_EVENT_GAP)}px`
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
            ref="cellElement"
        ></div>
    </div>
</template>

<style scoped>
.row {
    display: grid;
    border-top: var(--calendar-default-border);
    border-bottom: var(--calendar-default-border);

    .cell:not(:last-child) {
        border-right: var(--calendar-default-border);
    }

    .cell.is-today {
        background-color: var(--calendar-today-cell-background-color);
    }
}
</style>
