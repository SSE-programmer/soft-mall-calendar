<script
    lang="ts"
    setup
>
import { computed } from 'vue';
import { format } from 'date-fns';

interface Props {
    date: Date | number
}

const props = defineProps<Props>();
const month = computed(() => format(props.date, 'MMMM'));
const year = computed(() => format(props.date, 'yyyy'));
</script>

<template>
    <div class="sm-flex sm-flex sm-gap-4">
        <span class="sm-text-26 sm-font-bold">{{ month }}</span>
        <span class="sm-text-26 sm-font-bold sm-light-primary-color">{{ year }}</span>
    </div>
</template>

<style scoped></style>
