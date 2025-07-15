<script
    setup
    lang="ts"
>
import CalendarViewHeader from '@/pages/calendar-view/components/calendar-view-header/calendar-view-header.vue';
import { ref } from 'vue';
import pButton from 'primevue/button';
import pDatePicker from 'primevue/datepicker';
import CalendarViewGridWeek from '@/pages/calendar-view/components/calendar-view-grid/calendar-view-grid-week.vue';

const date = ref();
</script>

<template>
    <div class="calendar-container sm-flex sm-flex sm-flex-1 sm-border-radius-16 sm-overflow-hidden">
        <aside class="side-menu sm-flex sm-flex-col sm-gap-12 sm-p-16">
            <p-button
                class="sm-w-full"
            >
                + Создать событие
            </p-button>
            <p-date-picker
                class="sm-w-full"
                v-model="date"
                inline
                showWeek
            />
        </aside>
        <main class="sm-flex sm-flex-col sm-gap-12 sm-flex-1 sm-bg-light-background sm-w-full sm-p-16">
            <calendar-view-header></calendar-view-header>
            <calendar-view-grid-week></calendar-view-grid-week>
        </main>
    </div>
</template>

<style scoped>
.calendar-container {
    box-shadow: var(--sm-modals-box-shadow);
}

.side-menu {
    width: 350px;
    max-width: 350px;
    background: rgba(255, 255, 255, 0.23);
    backdrop-filter: blur(5px) opacity(0.1);
}
</style>
