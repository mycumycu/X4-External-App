<template>
  <div class="accordion-item border-top-0 border-start-0 border-end-0">
    <h2 class="accordion-header">
      <button class="accordion-button align-items-start" :class="{collapsed: !this.hasUnfilteredMissions()}" :disabled="!this.hasUnfilteredMissions()" type="button" data-bs-toggle="collapse"
              :data-bs-target="`#${elementId}`"
              aria-expanded="true">
        <div class="d-flex">
          <span class="group-type flex-grow-0 flex-shrink-0 badge bg-primary-outline me-2 text-capitalize">{{ groupName }}</span>
          <span class="group-name flex-grow-1 flex-shrink-1 flex-wrap">[{{ this.unfilteredMissionCount() }}] {{ this.buttonCaption(value) }}</span>
        </div>
      </button>
    </h2>
    <div :id="elementId" class="accordion-collapse collapse show" aria-labelledby="headingOne" :data-bs-parent="`#${elementId}`">
      <div class="accordion-body px-2 py-1">
        <mission-offers-mission
            v-for="(missionValue, index) in value.missions"
            :key="index"
            :mission-value="missionValue"
            :settings="settings"/>
      </div>
    </div>
  </div>
</template>

<script>
import MissionOffersMission from "./MissionOffersMission.vue";

export default {
  components: { MissionOffersMission },
  props: [
    'groupName',
    'name',
    'value',
    'settings',
  ],
  data() {
    return {
      elementId: "id" + Math.random().toString(36).slice(2)
    }
  },
  methods: {
    /**
     * Get number of active missions
     * @return {number}
     */
    unfilteredMissionCount() {
      return this.value.missions.reduce((acc, cv) => (cv) ? acc + 1 : acc, 0);
    },
    /**
     * @return {boolean}
     */
    hasUnfilteredMissions() {
      return this.unfilteredMissionCount() > 0
    },
    /**
     * @returns {*}
     */
    buttonCaption(value) {
      if (value.name) {
        return value.name;
      }
      return this.unfilteredMissionCount() === 1 ? this.$t('app.widgets.mission_offers.mission') : this.$t('app.widgets.mission_offers.missions')
    },

  },
  mounted() {
    //
  }
}
</script>

<style lang="scss" scoped>
@import "./scss/widget.scss";
</style>
