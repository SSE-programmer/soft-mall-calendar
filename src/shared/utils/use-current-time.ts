import { onMounted, onUnmounted, ref } from 'vue';

type UpdateInterval = 'second' | 'minute' | 'hour';

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;

interface NextUpdateIntervalStrategy {
    getNextInterval(): number;
}

class SecondUpdateIntervalStrategy implements NextUpdateIntervalStrategy {
    public getNextInterval(): number {
        const date = new Date();

        return SECONDS_IN_MINUTE - date.getSeconds();
    }
}

class HourUpdateIntervalStrategy implements NextUpdateIntervalStrategy {
    public getNextInterval(): number {
        const date = new Date();

        return MINUTES_IN_HOUR - date.getMinutes();
    }
}

class MinuteUpdateIntervalStrategy implements NextUpdateIntervalStrategy {
    public getNextInterval(): number {
        const date = new Date();

        return MILLISECONDS_IN_SECOND - date.getMilliseconds();
    }
}

export function useCurrentTime(updateIntervalStrategy: NextUpdateIntervalStrategy = new MinuteUpdateIntervalStrategy()) {
    const currentTime = ref(new Date());
    let timeoutId: number;

    onMounted(() => {
        timeout();
    });

    onUnmounted(() => {
        clearTimeout(timeoutId);
    });

    return { currentTime };

    function timeout() {
        timeoutId = setTimeout(() => {
            updateCurrentTime();
            timeout();
        }, updateIntervalStrategy.getNextInterval());
    }

    function updateCurrentTime() {
        currentTime.value = new Date();
    }
}
