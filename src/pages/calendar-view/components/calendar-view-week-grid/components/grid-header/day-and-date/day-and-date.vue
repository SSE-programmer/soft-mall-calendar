<script
    setup
    lang="ts"
>
import { formatDate } from 'date-fns';

interface Props {
    date: Date | number;
    isToday?: boolean;
    isOtherMonth?: boolean;
    isWeekend?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
    <div
        class="date sm-flex sm-gap-8 sm-items-center sm-justify-center sm-p-8 sm-border-radius-16"
        :class="{
            'is-today': isToday,
            'is-other-month': isOtherMonth,
            'is-weekend': isWeekend,
        }"
    >
        <span class="sm-font-bold">{{ formatDate(date, 'EEEEEE') }}</span>
        <span>{{ formatDate(date, 'd') }}</span>
    </div>
</template>

<style scoped>
.date {
    --weekend-color: #FF3F3F;
    --disabled-weekend-color: #ff7f7f;
}

.is-today {
    background: var(--sm-gray-middle-color);
}

.is-weekend {
    color: var(--weekend-color);
}

.is-other-month {
    color: var(--sm-ultra-light-primary-color);

    &.is-weekend {
        color: var(--disabled-weekend-color);
    }
}
</style>
