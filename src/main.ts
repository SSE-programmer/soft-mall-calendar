import './styles.scss';

import { createApp } from 'vue';
import App from './app.vue';
import router from './pages/router.ts';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';

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
