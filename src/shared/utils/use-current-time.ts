import { onMounted, onUnmounted, ref } from 'vue';

export function useCurrentTime(updateInterval = 60 * 1000) {
    const currentTime = ref(new Date());
    let intervalId: number;

    onMounted(() => {
        intervalId = setInterval(() => {
            currentTime.value = new Date();
        }, updateInterval);
    });

    onUnmounted(() => {
        clearInterval(intervalId);
    });

    return { currentTime };
}
