import { createApp } from 'vue';
import App from './App.vue';

// npm install vue-toastification@next
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// npm install -S vue-sweetalert2
import VueSweetAlert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import './assets/style.css';

const app = createApp(App);
app.use(Toast);
app.use(VueSweetAlert2);
app.mount('#app');
