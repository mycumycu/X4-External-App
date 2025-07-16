<template>
  <widget>
    <template #header>
      <h4>{{ $t('app.widgets.current_research.title') }}</h4>
    </template>

    <perfect-scrollbar :class="'resizable-element'" data-min-resizable-height="40" :options="{ suppressScrollX: true }">
      <div v-if="currentResearch.name">
        <current-research-entry :research="currentResearch"/>
      </div>
      <div v-else>{{ $t('app.widgets.current_research.none') }}</div>
    </perfect-scrollbar>
  </widget>
</template>

<script>
import Widget from "../Widget.vue";
import CurrentResearchEntry from "./CurrentResearchEntry.vue";

export default {
  components: { CurrentResearchEntry, Widget },
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

<style lang="scss" scoped>
@import "scss/widget.scss";
</style>
