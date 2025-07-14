import './styles.scss';

import { createApp } from 'vue';
import App from './app.vue';
import router from './pages/router.ts';

const app = createApp(App);

app.use(router);

app.mount('#app');
