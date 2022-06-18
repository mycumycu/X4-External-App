import {createApp} from 'vue'
import App from './App.vue'

import './scss/style.default.premium.scss';
import './vendor/bootstrap/js/bootstrap.bundle.min.js';

import {library} from '@fortawesome/fontawesome-svg-core'
import {faCogs, faCoins, faFont, faSearch, faThLarge, faTimes, faTrashAlt, faUserFriends} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import Helper from "./helper";
import AppUpgrader from "./appUpgrader";
import GlobalStore from "./globalStore";
import mitt from "mitt";
// import widgets
import WidgetConfig from "./widgetConfig.js";

library.add(faSearch, faTimes, faThLarge, faCoins, faUserFriends, faFont, faCogs, faTrashAlt);

Helper.disableContextMenu();
AppUpgrader.upgradeFromV200();

const app = createApp(App);

// auto register widgets
const components = import.meta.globEager('./widgets/*/*Widget.vue');

Object.entries(components).forEach(([path, definition]) => {
    /*
        Get name of component, based on widget filename
        "./widgets/logbook/LogbookWidget.vue" will become "Logbook"
     */
    const componentName = path.split('/').pop().replace(/Widget\.\w+$/, '')
    app.component(componentName, definition.default)
})

app.config.globalProperties.$filters = {
    str_limit(value, size) {
        let dots = '';
        if (!value) return '';
        value = value.toString();
        if (value.length > size && size !== 0) {
            dots = '...';
        }
        return value.substr(0, size) + dots;
    }
}
app.config.globalProperties.emitter = mitt()
app.config.globalProperties.widgetConfig = WidgetConfig
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(PerfectScrollbar, GlobalStore)
app.mount('#app')