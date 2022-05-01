import {createApp} from 'vue'
import App from './App.vue'

import './scss/style.default.premium.scss';
import './vendor/bootstrap/js/bootstrap.bundle.min.js';

import {library} from '@fortawesome/fontawesome-svg-core'
import {faCogs, faCoins, faFont, faSearch, faThLarge, faTimes, faTrashAlt, faUserFriends} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import GlobalStore from "./globalStore";
import mitt from "mitt";

const emitter = mitt()

library.add(faSearch, faTimes, faThLarge, faCoins, faUserFriends, faFont, faCogs, faTrashAlt);
const app = createApp(App)

app.config.globalProperties.emitter = emitter
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(PerfectScrollbar, GlobalStore)
app.mount('#app')