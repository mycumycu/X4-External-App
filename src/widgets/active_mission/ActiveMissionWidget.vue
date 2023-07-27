<template>
  <div class="card mt-4">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="active-mission">
          <h4 class="mb-4">Active mission</h4>
          <perfect-scrollbar :class="'resizable-element'" data-min-resizable-height="40">
            <div v-if="activeMission.name">
              <active-mission-entry :mission="activeMission"/>
              <div v-if="activeSubMission.name">
                <hr/>
                <active-mission-entry :mission="activeSubMission" class="mt-4"/>
              </div>
            </div>
            <div v-else>none</div>
          </perfect-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActiveMissionEntry from "./ActiveMissionEntry.vue";

export default {
  components: { ActiveMissionEntry },
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
      activeMission: {
        name: null,
        description: null,
        rewardtext: null,
        reward: null,
        factionname: null,
        subMissions: {}
      },
      activeSubMission: {
        name: null,
        description: null,
        rewardtext: null,
        reward: null,
        factionname: null,
        briefingText: null,
      },
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
      this.activeMission = {};
      this.activeSubMission = {};

      if (gameData !== "") {
        let missionData = gameData[1];
        this.activeMission = this.buildMissionObject(missionData)

        let subMission = missionData.subMissions[1] || null;
        if (missionData.subMissions && subMission.active) {
          this.activeSubMission = this.buildMissionObject(subMission)
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
        briefings = Object.entries(mission.briefingobjectives).map(element => {
          let index = element[0];
          let text = element[1].text;
          return {
            text: text,
            active: parseInt(index) === mission.activebriefingstep,
          }
        });
      }

      return {
        name: mission.name,
        description: mission.rawdescription,
        reward: mission.rewardmoney,
        rewardtext: mission.rewardtext,
        briefings: briefings,
      }
    }

  },
}
</script>

<style>
</style>