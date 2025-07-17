import './styles.scss';
import 'vue-toastification/dist/index.css';

import { createApp } from 'vue';
import App from './app.vue';
import router from './pages/router.ts';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import Aura from '@primeuix/themes/aura';
import Toast, { type PluginOptions } from 'vue-toastification';
import { createPinia, type Store } from 'pinia';
import { useCalendarEventsStore } from '@/stores/calendar/calendar-events.ts';
import { type ToastOptionsAndRequiredContent } from 'vue-toastification/src/types';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    },
    locale: {
        dateFormat: 'dd.mm.yy'
    }
});

const toastOptions: PluginOptions = {
    timeout: 2000,
    filterBeforeCreate: (
        toast: ToastOptionsAndRequiredContent,
        toasts: ToastOptionsAndRequiredContent[]
    ): ToastOptionsAndRequiredContent | false => {
        if (toasts.find(item => item.content === toast.content)) {
            return false;
        }

        return toast;
    }
};

app.use(Toast, toastOptions);

app.mount('#app');
app.onUnmount(() => clearSubscriptions());

app.directive('tooltip', Tooltip);

const calendarEventsStore = useCalendarEventsStore();
const piniaSubscriptions: (() => void)[] = [];

savePiniaStoreToLocalStorage(calendarEventsStore);

function savePiniaStoreToLocalStorage(store: Store) {
    const subscription = store.$subscribe((_, state) => {
        localStorage.setItem(store.$id, JSON.stringify(state));
    }, { detached: true });

    piniaSubscriptions.push(subscription);
}

function clearSubscriptions() {
    piniaSubscriptions.forEach(subscription => subscription());
}
