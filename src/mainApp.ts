import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import naive from 'naive-ui';

const app = createApp(App);
app.use(router).mount('#app');
app.use(naive);
