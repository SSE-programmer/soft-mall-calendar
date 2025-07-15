<script
    setup
    lang="ts"
>
import MonthAndYear from '@/pages/calendar-view/components/month-and-year/month-and-year.vue';
</script>

<template>
    <header class="sm-flex sm-gap-12 sm-flex-1 sm-justify-between sm-h-fit">
        <month-and-year :date="new Date()"></month-and-year>

        <div class="sm-flex sm-gap-8 sm-items-center">
            <button role="button"><</button>
            <button role="button">></button>
            <button role="button">Week</button>
        </div>
    </header>
</template>

<style scoped>

</style>
