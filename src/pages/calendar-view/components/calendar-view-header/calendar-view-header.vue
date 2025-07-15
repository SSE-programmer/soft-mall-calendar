<script
    setup
    lang="ts"
>
import MonthAndYear from '@/pages/calendar-view/components/month-and-year/month-and-year.vue';
import pButtonGroup from 'primevue/buttongroup';
import pButton from 'primevue/button';
import pSelect from 'primevue/select';
import { ref } from 'vue';
import type { ILabelValue } from '@/shared/models/common';
import type { IDisabled } from '@/shared/models/common/IDisabled.ts';

type ViewModeCode = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

const viewMode = ref<ViewModeCode>('WEEK');
const viewModeList = ref<(ILabelValue<ViewModeCode> & Partial<IDisabled>)[]>([
    { label: 'Day', value: 'DAY', disabled: true },
    { label: 'Week', value: 'WEEK' },
    { label: 'Month', value: 'MONTH', disabled: true },
    { label: 'Year', value: 'YEAR', disabled: true }
]);
</script>

<template>
    <header class="sm-flex sm-gap-12 sm-justify-between sm-h-fit">
        <month-and-year :date="new Date()"></month-and-year>

        <div class="sm-flex sm-gap-8 sm-items-center">
            <p-button-group class="sm-font-bold">
                <p-button><</p-button>
                <p-button>></p-button>
            </p-button-group>
            <p-select
                class="view-mode-select"
                v-model="viewMode"
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
