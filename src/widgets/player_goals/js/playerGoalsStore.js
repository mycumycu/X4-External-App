import {createStore} from "vuex";
import Helper from "./helper";

export default createStore({
    state: {
        goals: JSON.parse(
            localStorage.getItem("goals")
        ) || {
            short: [],
            long: [],
        }

    },
    mutations: {
        /**
         * @param state
         */
        save(state) {
            localStorage.setItem("goals", JSON.stringify(state.goals));
        },
        /**
         * @param state
         * @param key
         * @param id
         */
        moveToBottom(state, { key, id }) {
            let index = Helper.getGoalIndex(state.goals[key], id);
            state.goals[key].push(state.goals[key].splice(index, 1)[0]);
        },
        /**
         * @param state
         * @param key
         * @param id
         */
        remove(state, { key, id }) {
            let index = Helper.getGoalIndex(state.goals[key], id);
            state.goals[key].splice(index, 1);
        },
        /**
         * Merge short and longterm lists
         * @param state
         */
        mergeLists(state) {
            state.goals.short = [
                ...state.goals.short,
                ...state.goals.long
            ];
            state.goals.long = [];
        }
    },
})