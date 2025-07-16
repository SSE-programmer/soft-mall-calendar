import './styles.scss';

import { createApp } from 'vue';
import App from './app.vue';
import router from './pages/router.ts';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import Aura from '@primeuix/themes/aura';
import { createPinia, type Store } from 'pinia';
import { useCalendarEventsStore } from '@/stores/calendar/calendar-events.ts';

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
