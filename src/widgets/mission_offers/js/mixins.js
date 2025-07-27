import { snakeCase } from "lodash";

export default {
    methods: {
        /**
         * Get mission type name
         */
        getMissionTypeName(missionType) {
            return this.$t('app.widgets.mission_offers.mission_types.' + snakeCase(missionType));
        },
        /**
         * Get mission difficulty name
         */
        getMissionDifficultyName(difficulty) {
            return this.$t('app.widgets.mission_offers.difficulty_levels.' + snakeCase(difficulty));
        },
    }
};