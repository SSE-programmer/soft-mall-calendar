<script
    setup
    lang="ts"
>
import { WEEK_VIEW_SIDE_COLUMN_WIDTH } from '@/pages/calendar-view/constants/calendar.ts';
import { isSameMonth, isToday, isWeekend } from 'date-fns';
import DayAndDate
    from '@/pages/calendar-view/components/calendar-view-week-grid/components/grid-header/day-and-date/day-and-date.vue';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar/calendar.ts';

interface Props {
    days: Date[];
}

const props = defineProps<Props>();
const { selectedDate } = storeToRefs(useCalendarStore());

const currentUTCOffset = ref<string>(getCurrentUTCOffset());

function getCurrentUTCOffset() {
    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60;
    const sign = offsetHours >= 0 ? '+' : '-';

    return `UTC${sign}${Math.abs(offsetHours)}`;
}

function isOtherMonth(date: Date): boolean {
    return !isSameMonth(date, selectedDate.value);
}
</script>

<template>
    <div class="sm-flex">
        <div
            class="sm-flex sm-gap-8 sm-items-center sm-justify-center sm-p-8 sm-ultra-light-primary-color sm-overflow-hidden"
            :style="{
                width: WEEK_VIEW_SIDE_COLUMN_WIDTH,
                'min-width': WEEK_VIEW_SIDE_COLUMN_WIDTH,
                'max-width': WEEK_VIEW_SIDE_COLUMN_WIDTH
            }">
            {{ currentUTCOffset }}
        </div>
        <div
            v-for="day in days"
            :key="day.getTime()"
            class="sm-flex sm-flex-col sm-flex-1"
        >
            <day-and-date
                :date="day"
                :is-today="isToday(day)"
                :is-other-month="isOtherMonth(day)"
                :is-weekend="isWeekend(day)"
            ></day-and-date>
        </div>
    </div>
</template>

<style scoped>

</style>
