<script
    setup
    lang="ts"
>
import MonthAndYear from '@/pages/calendar-view/components/month-and-year/month-and-year.vue';
import pButtonGroup from 'primevue/buttongroup';
import pButton from 'primevue/button';
import pSelect from 'primevue/select';

import { useCalendarStore } from '@/stores/calendar/calendar.ts';
import { storeToRefs } from 'pinia';
import {
    DaySwitchStrategy,
    type ISwitchStrategy, MonthSwitchStrategy,
    WeekSwitchStrategy, YearSwitchStrategy
} from '@/pages/calendar-view/components/calendar-view-header/switch-strategies.ts';
import type { ViewModeCode } from '@/pages/calendar-view/models/ViewModeCode.ts';

const { selectedDate, viewModeCode, viewModeList } = storeToRefs(useCalendarStore());
const switchStrategyByViewMode: Record<ViewModeCode, ISwitchStrategy> = {
    DAY: new DaySwitchStrategy(),
    WEEK: new WeekSwitchStrategy(),
    MONTH: new MonthSwitchStrategy(),
    YEAR: new YearSwitchStrategy()
}

function previousCalendarPage() {
    selectedDate.value = switchStrategyByViewMode[viewModeCode.value].previous(selectedDate.value);
}

function nextCalendarPage() {
    selectedDate.value = switchStrategyByViewMode[viewModeCode.value].next(selectedDate.value);
}
</script>

<template>
    <header class="sm-flex sm-gap-12 sm-justify-between sm-h-fit">
        <month-and-year :date="selectedDate"></month-and-year>

        <div class="sm-flex sm-gap-8 sm-items-center">
            <p-button-group class="sm-font-bold">
                <p-button @click="previousCalendarPage"><</p-button>
                <p-button @click="nextCalendarPage">></p-button>
            </p-button-group>

            <p-select
                class="view-mode-select"
                v-model="viewModeCode"
                :options="viewModeList"
                option-label="label"
                option-value="value"
                option-disabled="disabled"
            ></p-select>
        </div>
    </header>
</template>

<style scoped>
.view-mode-select {
    width: 150px;
}
</style>
