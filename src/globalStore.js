import {createStore} from "vuex";

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
                        {
                            component: 'playerProfile',
                            maxHeight: 40,
                        },
                        {
                            component: 'activeMission',
                            maxHeight: 40,
                        },
                    ]
                },
                {
                    width: 4,
                    widgets: [
                        {
                            component: 'missionOffers',
                            maxHeight: 100,
                        },
                    ]
                },
                {
                    width: 5,
                    widgets: [
                        {
                            component: 'logbook',
                            maxHeight: 100,
                        },
                    ]
                },
            ]
        },
    },
    mutations: {
        updateLayout(state, newValue) {
            state.layout = newValue;
            localStorage.setItem("layout", JSON.stringify(newValue));
        }
    },
})