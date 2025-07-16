<script
    setup
    lang="ts"
>
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar.ts';
import { computed } from 'vue';
import { addDays, isSameMonth, isToday, startOfWeek, isWeekend } from 'date-fns';
import { WEEK_LENGTH, WEEK_START } from '@/shared/constants/calendar.ts';
import DayAndDate from '@/pages/calendar-view/components/calendar-view-grid/components/day-and-date/day-and-date.vue';

const { selectedDate } = storeToRefs(useCalendarStore());
const days = computed<Date[]>(() => {
    const weekStart = startOfWeek(selectedDate.value, { weekStartsOn: WEEK_START });

    return Array.from({ length: WEEK_LENGTH }).map((_, index) => addDays(weekStart, index));
});

function isOtherMonth(date: Date): boolean {
    return !isSameMonth(date, selectedDate.value);
}
</script>

<template>
    <div class="sm-flex sm-flex-col">
        <div class="sm-flex">
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
    </div>
</template>

<style scoped>
</style>
