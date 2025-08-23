import { createStore } from "vuex";

const key = "playerProfileSettings";

export default createStore({
    state: {
        settings: JSON.parse(localStorage.getItem(key)) || {
            showPlayerName: true,
            showBanner: true,
            showSectorName: true,
            showSectorOwner: false,
        }
    },
    mutations: {
        updateSettings(state, payload) {
            state.settings = { ...state.settings, ...payload };
            localStorage.setItem(key, JSON.stringify(state.settings));
        },
    },
});