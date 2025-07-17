import { onMounted, onUnmounted, type Ref, ref, watch } from 'vue';
import { debounce } from '@/shared/utils/debounce.ts';

export function useElementSize(elementRef: Ref<HTMLElement | null>, debounceTime = 200) {
    const width = ref(0);
    const height = ref(0);
    let observer: ResizeObserver | null = null;

    const disconnect = () => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    };

    const connect = () => {
        let element = elementRef.value;

        if (Array.isArray(element)) {
            if (element.length) {
                element = element[0];
            } else {
                element = null;
            }
        }

        if (element) {
            observer = new ResizeObserver(debounce(entries => {
                for (let entry of entries) {
                    width.value = entry.contentRect.width;
                    height.value = entry.contentRect.height;
                }
            }, debounceTime));
            observer.observe(element, { box: 'device-pixel-content-box'});
        }
    };

    onMounted(() => {
        watch(elementRef, (newVal) => {
            disconnect();

            if (newVal) {
                connect();
            }
        }, { immediate: true });
    });

    onUnmounted(() => {
        disconnect();
    });

    return { width, height };
}
