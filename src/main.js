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
// import widgets
import WidgetConfig from "./widgetConfig.js";

const emitter = mitt()

library.add(faSearch, faTimes, faThLarge, faCoins, faUserFriends, faFont, faCogs, faTrashAlt);
const app = createApp(App)

// auto register widgets
const components = import.meta.globEager('./widgets/*/*Widget.vue')

Object.entries(components).forEach(([path, definition]) => {
    /*
        Get name of component, based on widget filename
        "./widgets/logbook/LogbookWidget.vue" will become "Logbook"
     */
    const componentName = path.split('/').pop().replace(/Widget\.\w+$/, '')
    app.component(componentName, definition.default)
})

app.config.globalProperties.emitter = emitter
app.config.globalProperties.widgetConfig = WidgetConfig
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(PerfectScrollbar, GlobalStore)
app.mount('#app')