import {createStore} from "vuex";
import WidgetConfig from "./widgets"

// default heights (when no localStorage object exists)
WidgetConfig.playerProfile.maxHeight = 40;
WidgetConfig.activeMission.maxHeight = 60;
WidgetConfig.missionOffers.maxHeight = 100;
WidgetConfig.logbook.maxHeight = 100;

export default createStore({
    state: {
        layout: JSON.parse(
            localStorage.getItem("layout")
        ) || {
            limitHeight: true,
            showBreadcrumb: true,
            columns: [
                {
                    width: 3,
                    widgets: [
                        WidgetConfig.playerProfile,
                        WidgetConfig.activeMission,
                    ]
                },
                {
                    width: 4,
                    widgets: [
                        WidgetConfig.missionOffers,
                    ]
                },
                {
                    width: 5,
                    widgets: [
                        WidgetConfig.logbook,
                    ]
                },
            ]
        },
    },
    mutations: {
        updateLayout(state, n) {
            state.layout = n;
            localStorage.setItem("layout", JSON.stringify(n));
        }
    },
})