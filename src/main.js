import axios from 'axios'
import naive from 'naive-ui'
import { createApp } from 'vue'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'

import { longClickDirective } from 'vue-long-click'
import global from './components/common.vue'


import "node-snackbar/dist/snackbar.min.css"

import 'boxicons/css/boxicons.min.css'


const app = createApp(App);

app.config.globalProperties.$cookies = VueCookies;
app.config.globalProperties.COMMON = global;
app.use(naive).use(router).use(VueAxios, axios);
app.mount('#app');

