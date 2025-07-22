import type { ICalendarEvent } from '@/pages/calendar-view/models/ICalendarEvent.ts';
import { computed, type Ref, ref, watch } from 'vue';
import { eventDurationComparator } from '@/pages/calendar-view/utils';
import { useCalendarEventsStore } from '@/stores/calendar/calendar-events.ts';
import { areIntervalsOverlapping, endOfDay, isAfter, isBefore, startOfDay } from 'date-fns';
import {
    getTopPositionByTime
} from '@/pages/calendar-view/components/calendar-view-week-grid/components/timeline-rows/utils/get-top-position-by-time.ts';
import { WEEK_VIEW_CELL_PADDING, WEEK_VIEW_FULL_DATE_EVENT_GAP } from '@/pages/calendar-view/constants/calendar.ts';

export interface IPreparedCalendarEvent extends ICalendarEvent {
    position: IPosition;
    truncatedBeginning: boolean;
    truncatedEnd: boolean;
}

interface IPosition {
    top: string;
    right: string;
    bottom: string;
    left: string;
}

interface IEventsByDay {
    day: Date;
    events: ICalendarEvent[];
}

interface IPreparedEventsByDay {
    day: Date;
    events: IPreparedCalendarEvent[][];
}

export const usePreparedEvents = (days: Ref<Date[]>) => {
    const calendarEventsStore = useCalendarEventsStore();
    const { getEvents } = calendarEventsStore;

    const firstDay = computed(() => days.value[0]);
    const lastDay = computed(() => days.value[days.value.length - 1]);
    const events = ref<ICalendarEvent[]>([]);
    const sortedEvents = computed<ICalendarEvent[]>(() => events.value.sort(eventDurationComparator));
    const eventsByDay = computed<IEventsByDay[]>(() => {
        return days.value.map(day => ({
            day,
            events: sortedEvents.value.filter(event => {
                return areIntervalsOverlapping(
                    {
                        start: startOfDay(day),
                        end: endOfDay(day)
                    },
                    {
                        start: event.calculatedStart,
                        end: event.calculatedEnd,
                    },
                    { inclusive: true },
                );
            })
        }));
    });

    const loadEvents = () => {
        if (days.value.length > 0) {
            events.value = getEvents({
                fullDay: false,
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

    const preparedEventsByDay = computed(() => {
        const resultByDate: IPreparedEventsByDay[] = [];

        for (const dayItem of eventsByDay.value) {
            const result = [];

            for (const event of dayItem.events) {
                const preparedEvent = getPreparedEventEntity(event, dayItem.day);

                if (!result.length) {
                    result.push([preparedEvent]);

                    continue;
                }

                let foundRow = false;

                for (const column of result) {
                    const noIntersection = column.every(item => {
                        const preparedItem = getPreparedEventEntity(item, dayItem.day);

                        return parseInt(preparedItem.position.top) < parseInt(preparedEvent.position.bottom) && parseInt(preparedItem.position.bottom) <= parseInt(preparedEvent.position.top) ||
                            parseInt(preparedItem.position.top) >= parseInt(preparedEvent.position.bottom) && parseInt(preparedItem.position.bottom) > parseInt(preparedEvent.position.top);
                    });

                    if (noIntersection) {
                        foundRow = true;
                        column.push(preparedEvent);

                        break;
                    }
                }

                if (!foundRow) {
                    result.push([preparedEvent]);
                }
            }

            resultByDate.push({
                day: dayItem.day,
                events: result
            })
        }

        calculateLeftAndRightPositions(resultByDate);

        return resultByDate;

        function getPreparedEventEntity(event: ICalendarEvent, day: Date): IPreparedCalendarEvent {
            let eventStart = event.calculatedStart;
            let eventEnd = event.calculatedEnd;

            let truncatedBeginning = false;
            let truncatedEnd = false;

            if (isBefore(eventStart, startOfDay(day))) {
                eventStart = startOfDay(day);
                truncatedBeginning = true;
            }

            if (isAfter(eventEnd, endOfDay(day))) {
                eventEnd = endOfDay(day);
                truncatedEnd = true;
            }

            return {
                ...event,
                position: {
                    top: getTopPositionByTime(eventStart),
                    bottom: `calc(100% - ${getTopPositionByTime(eventEnd)})`,
                    left: '0px',
                    right: '0px'
                },
                truncatedBeginning,
                truncatedEnd,
            };
        }

        function calculateLeftAndRightPositions(preparedEventsByDay: IPreparedEventsByDay[]) {
            preparedEventsByDay.forEach((dayItem) => {
                const columns = dayItem.events.length;
                const gaps = columns - 1;
                const columnWidth = `calc((100% - ${WEEK_VIEW_CELL_PADDING} * 2 - ${WEEK_VIEW_FULL_DATE_EVENT_GAP} * ${gaps}) / ${columns})`;

                dayItem.events.forEach((column: IPreparedCalendarEvent[], index) => {
                    return column.forEach((event: IPreparedCalendarEvent) => {
                        event.position.left = `calc(${columnWidth} * ${index} + ${WEEK_VIEW_FULL_DATE_EVENT_GAP} * ${index} + ${WEEK_VIEW_CELL_PADDING})`;
                        event.position.right = `calc(100% - ${event.position.left} - ${columnWidth})`;
                    })
                })
            });
        }
    });

    return preparedEventsByDay;
};
