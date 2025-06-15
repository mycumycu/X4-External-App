<template>
  <widget>
    <template #header>
      <h4>{{ $t('app.widgets.active_mission.title') }}</h4>
    </template>

    <div class="d-flex align-items-center">
      <div class="active-mission">
        <perfect-scrollbar :class="'resizable-element'" data-min-resizable-height="40">
          <div v-if="activeMission.name">
            <active-mission-entry :mission="activeMission"/>
            <div v-if="activeSubMission.name">
              <hr/>
              <active-mission-entry :mission="activeSubMission" class="mt-4"/>
            </div>
          </div>
          <div v-else>{{ $t('app.widgets.active_mission.none') }}</div>
        </perfect-scrollbar>
      </div>
    </div>
  </widget>
</template>

<script>
import Widget from "../Widget.vue";
import ActiveMissionEntry from "./ActiveMissionEntry.vue";

export default {
  components: { Widget, ActiveMissionEntry },
  props: {
    gameData: [Object, String],
    maxHeight: {
      type: Number,
      default: 40
    },
  },
  /**
   * @returns {{activeMission: {rewardtext: null, reward: null, name: null, description: null, subMissions: {}}, activeSubMission: {rewardtext: null, reward: null, name: null, description: null}}}
   */
  data() {
    return {
      activeMission: this.resetMission(),
      activeSubMission: this.resetMission(),
    }
  },
  /**
   */
  watch: {
    gameData: {
      handler(newData, oldData) {
        this.parseActiveMissionData(newData);
      },
    },
  },
  methods: {
    /**
     * @param gameData
     */
    parseActiveMissionData(gameData) {
      this.activeMission = this.resetMission();
      this.activeSubMission = this.resetMission();

      if (Object.keys(gameData).length !== 0) {
        let missionData = gameData[0];
        this.activeMission = this.buildMissionObject(missionData)

        for (let subMission of missionData.subMissions) {
          if (subMission.active) {
            this.activeSubMission = this.buildMissionObject(subMission);
          }
        }
      }
    },
    /**
     * @param mission
     * @returns {{reward: *, rewardtext: (null|*), briefingText, name, description: *}}
     */
    buildMissionObject(mission) {
      let briefings = [];
      if (Object.keys(mission.briefingobjectives).length > 0) {
        briefings = Object.values(mission.briefingobjectives).map(element => {
          return {
            text: element.text,
            completed: element.step < mission.activebriefingstep,
            active: element.step === mission.activebriefingstep,
          }
        });
      }

      return {
        name: mission.name,
        description: mission.rawdescription,
        reward: mission.rewardmoney,
        rewardtext: mission.rewardtext,
        timeout: mission.timeout,
        briefings: briefings,
      }
    },

    /**
     *
     * @returns {{rewardtext: null, reward: null, name: null, description: null, factionname: null, subMissions: {}}}
     */
    resetMission() {
      return {
        name: null,
        description: null,
        rewardtext: null,
        reward: null,
        factionname: null,
        subMissions: {}
      };
    }

  },
}
</script>

<style lang="scss" scoped>
@import "./scss/widget.scss";
</style>
