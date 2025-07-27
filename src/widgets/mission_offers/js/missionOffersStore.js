import { createStore } from "vuex";

export default createStore({
    state: {
        settings: JSON.parse(
            localStorage.getItem("missionOffersSettings")
        ) || {
            difficulties: [
                {
                    index: 1,
                    name: 'trivial',
                    enabled: true
                },
                {
                    index: 2,
                    name: 'very_easy',
                    enabled: true
                },
                {
                    index: 3,
                    name: 'easy',
                    enabled: true
                },
                {
                    index: 4,
                    name: 'medium',
                    enabled: true
                },
                {
                    index: 5,
                    name: 'hard',
                    enabled: true
                },
                {
                    index: 6,
                    name: 'very_hard',
                    enabled: true
                },
            ],

            types: [
                {
                    name: 'plot',
                    enabled: true,
                },
                {
                    name: 'guild',
                    enabled: true,
                },
                {
                    name: 'other',
                    enabled: true,
                },
                {
                    name: 'coalition',
                    enabled: true,
                },
            ],

            descriptions: 0,
            objectives: false,
        }
    },
    mutations: {
        /**
         * Save settings to localStorage
         * @param state
         */
        save(state) {
            localStorage.setItem("missionOffersSettings", JSON.stringify(state.settings));
        },
    },
})