import {createStore} from "vuex";

export default createStore({
    state: {
        goals: JSON.parse(
            localStorage.getItem("goals")
        ) || {
            short: [
                {
                    id: '23qassa3',
                    task: 'Add your first short-term goal',
                    checked: false,
                    featuredIndex: 0,
                },
            ],
            long: [
                {
                    id: '55df5fd5df',
                    task: 'You can also add your long-term goals',
                    checked: false,
                    featuredIndex: 0,
                },
            ],
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
            Object.values(state.goals[key]).forEach((element, index) => {
                if (element.id === id) {
                    state.goals[key].push(state.goals[key].splice(index, 1)[0]);
                }
            })
        },
        /**
         * @param state
         * @param key
         * @param id
         */
        remove(state, { key, id }) {
            Object.values(state.goals[key]).forEach((element, index) => {
                if (element.id === id) {
                    state.goals[key].splice(index, 1);
                }
            })
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