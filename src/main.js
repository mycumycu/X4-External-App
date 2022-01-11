import {createApp} from 'vue'
import App from './App.vue'

import './scss/style.default.premium.scss';
import './vendor/bootstrap/js/bootstrap.bundle.min.js';

import {library} from '@fortawesome/fontawesome-svg-core'
import {faCoins, faFont, faSearch, faThLarge, faTimes, faUserFriends} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'


library.add(faSearch, faTimes, faThLarge, faCoins, faUserFriends, faFont)
createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(PerfectScrollbar).mount('#app')
