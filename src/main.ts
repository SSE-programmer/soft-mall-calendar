import './styles.scss';

import { createApp } from 'vue';
import App from './app.vue';
import router from './pages/router.ts';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app');
