<template>
  <div class="card mt-4">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="active-mission">
          <h4 class="mb-4">Active mission</h4>
          <perfect-scrollbar :class="'resizable-element'" data-min-resizable-height="40">
            <div v-if="activeMission.name">
              <active-mission-entry :mission="activeMission"/>
              <active-mission-entry :mission="activeSubMission" v-if="activeSubMission.name" class="mt-4"/>
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
        subMissions: {}
      },
      activeSubMission: {
        name: null,
        description: null,
        rewardtext: null,
        reward: null,
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
        let activeMission = gameData[1];

        this.activeMission = {
          name: activeMission.name,
          description: activeMission.description,
          reward: activeMission.reward,
          rewardtext: activeMission.rewardtext,
        }

        let subMission = activeMission.subMissions[1] || null;
        if (activeMission.subMissions && subMission.active) {
          this.activeSubMission = {
            name: subMission.name,
            description: subMission.description,
            reward: subMission.reward,
            rewardtext: subMission.rewardtext,
          }
        }
      }
    },
  },
}
</script>

<style>
</style>