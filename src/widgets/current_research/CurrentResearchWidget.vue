<template>
  <div class="card mt-4">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="active-mission w-100">
          <h4 class="mb-4">Current Research</h4>
          <perfect-scrollbar :class="'ps-active-mission resizable-element'" data-min-resizable-height="40" :options="{ suppressScrollX: true }">
            <div v-if="currentResearch.name">
              <current-research-entry :research="currentResearch"/>
            </div>
            <div v-else>none</div>
          </perfect-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CurrentResearchEntry from "./CurrentResearchEntry.vue";

export default {
  components: { CurrentResearchEntry },
  props: {
    gameData: [Object, String],
    maxHeight: {
      type: Number,
      default: 40
    },
  },
  /**
   * @returns {{currentResearch: {percentageCompleted: null, researchtime: null, precursors: [{name: null}], name: null, description: null, resources: [{totalAmount: null, name: null, currentAmount: null}]}}}
   */
  data() {
    return {
      currentResearch: {
        name: null,
        description: null,
        researchtime: null,
        precursors: [
          {
            name: null,
          },
        ],
        resources: [
          {
            name: null,
            currentAmount: null,
            totalAmount: null,
          }
        ],
        percentageCompleted: null
      },
    }
  },
  /**
   */
  watch: {
    gameData: {
      handler(newData, oldData) {
        this.parseCurrentResearch(newData);
      },
    },
  },
  methods: {
    /**
     * @param gameData
     */
    parseCurrentResearch(gameData) {
      this.currentResearch = {};

      if (gameData !== "") {

        this.currentResearch = {
          name: gameData.name,
          description: gameData.description,
          researchtime: gameData.researchtime,
          precursors: gameData.precursors,
          resources: gameData.resources,
          percentageCompleted: gameData.percentageCompleted,
        }
      }
    },
  },
}
</script>

<style>
</style>