<template>
  <widget>
    <template #header>
      <div class="d-flex justify-content-between">
        <h4 class="card-title pb-0 mb-0">{{ $t('app.widgets.factions.title') }}</h4>
        <div>
          <font-awesome-icon class="cursor-pointer" :icon="`cogs`" data-bs-toggle="modal" data-bs-target="#factions-settings"/>
          <Modal id="factions-settings" :title="$t('app.widgets.factions.settings.title')" size="modal-lg">
            <FactionsSettings :settings="factions.settings"/>
          </Modal>
        </div>
      </div>
    </template>

    <perfect-scrollbar class="factions resizable-element" data-min-resizable-height="90">
      <div class="row mx-0">
        <template v-for="(entry, index) in factions.list">
          <factions-entry
              :settings="factions.settings"
              :entry="entry"/>
        </template>
      </div>
    </perfect-scrollbar>
  </widget>
</template>

<script>

import Widget from "../Widget.vue";
import Modal from "../../components/Modal.vue";
import FactionsSettings from "./FactionsSettings.vue";
import SearchBar from "../../components/SearchBar.vue";
import { reactive } from "vue";
import LogbookEntry from "../logbook/LogbookEntry.vue";
import FactionsEntry from "./FactionsEntry.vue";

export default {
  components: {
    FactionsEntry,
    LogbookEntry,
    Modal, FactionsSettings: FactionsSettings, SearchBar, Widget
  },
  props: {
    gameData: Object,
    maxHeight: {
      type: Number,
      default: 100
    },
  },
  /**
   */
  watch: {
    gameData: {
      handler(newData, oldData) {
        this.parseFactionsData(newData)
      },
    },
    'factions.settings': {
      handler(newList, oldList) {
        //
      },
      deep: true
    },
  },
  methods: {
    /**
     *
     */
    parseFactionsData(gameData) {
      let excludedFactions = this.factions.settings.excludedFactions.split(',').map((faction) => {
        return faction.trim().toLowerCase();
      });

      // filter player and excluded factions and those with relations disabled
      this.factions.list = gameData.filter((faction) => {
        return faction.id !== 'player' &&
            !excludedFactions.includes(faction.shortname.toLowerCase()) &&
            this.getRelationLevels().includes(faction.relation);
      });
    },
    /**
     * Get allowed relation levels array
     */
    getRelationLevels() {
      return this.factions.settings.relationLevels.map((level) => {
        return level.enabled ? this.arrayFill(level.min, level.max) : [];
      }).flat();
    },
    /**
     * Fills an array with a sequence of numbers.
     *
     * @param {number} start - The starting value of the sequence.
     * @param {number} stop - The ending value of the sequence.
     *
     * @return {Array} - The filled array containing the sequence of numbers.
     */
    arrayFill(start, stop) {
      return Array.from(
          { length: (stop - start) + 1 },
          (value, index) => start + index
      );
    }
  },
  computed: {
    //
  },
  mounted() {
    //
  },
  /**
   * @return {{factions: {list: [], settings: {excludedFactions: string, showRelationChanges: boolean, relationLevels: {index: number, name: string, min: number, max: number, enabled: boolean}[]}}}}
   */
  data() {
    return {
      factions: {
        list: [],
        settings: reactive(
            JSON.parse(localStorage.getItem("factionsSettings")) || {
              excludedFactions: '',
              showRelationChanges: true,
              showLicenceIndicators: true,
              relationLevels: [
                {
                  name: 'ally',
                  min: 20,
                  max: 30,
                  enabled: true
                },
                {
                  name: 'enemy',
                  min: -19,
                  max: -10,
                  enabled: true
                },
                {
                  name: 'friend',
                  min: 10,
                  max: 19,
                  enabled: true
                },
                {
                  name: 'hostile',
                  min: -30,
                  max: -20,
                  enabled: true
                },
                {
                  name: 'neutral',
                  min: -9,
                  max: 9,
                  enabled: true
                },
              ],
            }
        ),
      },
    }
  },
}
</script>

<style lang="scss" scoped>
@import "./scss/widget.scss";
</style>
