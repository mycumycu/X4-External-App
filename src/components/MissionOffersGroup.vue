<template>
  <div class="accordion-item border-top-0 border-start-0 border-end-0">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#${elementId}`" aria-expanded="true" aria-controls="collapseOne">
        [{{ this.missionsCount() }}] {{ value.name }}
      </button>
    </h2>
    <div :id="elementId" class="accordion-collapse collapse show" aria-labelledby="headingOne" :data-bs-parent="`#${elementId}`">
      <div class="accordion-body px-2 py-1">
        <mission-offers-mission
            v-for="(missionValue, index) in value.missions" :key="index" :mission-value="missionValue"/>
      </div>
    </div>
  </div>
</template>

<script>
import MissionOffersMission from "./MissionOffersMission.vue";

export default {
  components: { MissionOffersMission },
  props: [
    'group',
    'name',
    'value',
  ],
  data() {
    return {
      groupName: null,
      groupMissions: {},
      elementId: "id" + Math.random().toString(36).slice(2)
    }
  },
  methods: {
    /**
     * Get number of missions
     * @return {number}
     */
    missionsCount() {
      return Object.keys(this.value.missions).length;
    },

  },
  mounted() {
    //
  }
}
</script>

<style>
</style>