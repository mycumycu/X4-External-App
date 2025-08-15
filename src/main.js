import { createApp } from 'vue'
import App from './App.vue'

import './scss/style.default.premium.scss';
import './scss/user/_modal.scss';
import './vendor/bootstrap/js/bootstrap.bundle.min.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faClock,
    faCogs,
    faCoins,
    faExpand,
    faFont,
    faMicrophone,
    faSearch,
    faStar,
    faThLarge,
    faTimes,
    faTrashAlt,
    faUserFriends
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import Helper from "./helper";
import AppUpgrader from "./appUpgrader";
import GlobalStore from "./globalStore";
import mitt from "mitt";
import { createI18n } from 'vue-i18n'
import { defaultLocale, languages } from './languages'

// import widgets
import WidgetConfig from "./widgetConfig.js";

// Build messages object for i18n
const messages = Object.fromEntries(
    Object.entries(languages).map(([code, lang]) => [code, lang.messages])
)

const i18n = createI18n({
    locale: defaultLocale,
    fallbackLocale: defaultLocale,
    messages,
})

library.add(faSearch, faStar, faTimes, faThLarge, faExpand, faCoins, faUserFriends, faFont, faCogs, faTrashAlt, faClock, faMicrophone);

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
app.config.unwrapInjectedRef = true
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(GlobalStore)
app.use(PerfectScrollbar, { options: { suppressScrollX: true } })
app.use(i18n)
app.mount('#app')
