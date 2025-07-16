import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ViewModeCode } from '@/pages/calendar-view/models/ViewModeCode.ts';
import type { ILabelValue } from '@/shared/models/common';
import type { IDisabled } from '@/shared/models/common/IDisabled.ts';

export const useCalendarStore = defineStore('calendar', () => {
    const selectedDate = ref<Date>(new Date());
    const viewModeCode = ref<ViewModeCode>('WEEK');
    const viewModeList = ref<(ILabelValue<ViewModeCode> & Partial<IDisabled>)[]>([
        { label: 'Day', value: 'DAY', disabled: true },
        { label: 'Week', value: 'WEEK' },
        { label: 'Month', value: 'MONTH', disabled: true },
        { label: 'Year', value: 'YEAR', disabled: true }
    ]);

    function setViewModeCode(value: ViewModeCode): void {
        viewModeCode.value = value;
    }

    function setSelectedDate(value: Date | number): void {
        selectedDate.value = value instanceof Date ? value : new Date(value);
    }

    return {
        selectedDate,
        viewModeCode,
        viewModeList,
        setViewModeCode,
        setSelectedDate
    };
});
