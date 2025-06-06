<template>
  <widget>
    <template #header>
      <div class="d-flex justify-content-between">
        <div><h4 class="card-title pb-3">Mission Offers</h4></div>
        <div>
          <font-awesome-icon :icon="`cogs`" class="cursor-pointer" data-bs-toggle="modal" data-bs-target="#mission-offers-setings"/>
          <Modal id="mission-offers-setings" title="Mission offers settings" size="modal-md">
            <MissionOffersSettings :settings="missionOffers.settings"/>
          </Modal>
        </div>
      </div>
      <search-bar @search="filterMissionOffers"/>
    </template>

    <div class="list-group">
      <div class="list-group-item border-0 py-2 px-0">
        <div class="d-flex flex-column">
          <div>
            <div class="overflow-hidden" style="height: 50px">
                      <span v-if="missionDifficultiesRules.length <=0">
                        <span class="badge bg-secondary">Adjust mission offers settings using <font-awesome-icon :icon="`cogs`"/> icon above.</span>
                      </span>
              <span class="rules-string d-inline" v-if="missionDifficultiesRules.length > 0 ">
                        <span class="badge bg-primary me-1">Difficulties</span>
                          <span v-for="value in missionDifficultiesRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                      </span>
              <span class="rules-string d-inline" v-if="missionTypesRules.length > 0 ">
                        <span class="badge bg-primary me-1">Types</span>
                          <span v-for="value in missionTypesRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                      </span>
            </div>
          </div>
          <div>
            <div class="accordion pt-2">
              <perfect-scrollbar :class="'resizable-element'" data-min-resizable-height="90">
                <div v-for="(value, group) in missionOffers.filtered">
                  <div v-if="shouldShowMissionGroup(value)">
                    <mission-offers-group
                        v-for="(value, name) in value"
                        :group="group"
                        :name="name"
                        :value="value"
                        :settings="missionOffers.settings"/>
                  </div>
                </div>
              </perfect-scrollbar>
            </div>
          </div>
        </div>
      </div>
    </div>
  </widget>
</template>

<script>

import Widget from "../Widget.vue";
import Modal from "../../components/Modal.vue";
import MissionOffersGroup from "./MissionOffersGroup.vue";
import MissionOffersSettings from "./MissionOffersSettings.vue";
import SearchBar from "../../components/SearchBar.vue";
import {reactive} from "vue";

export default {
  components: {
    Modal,
    MissionOffersGroup,
    MissionOffersSettings,
    SearchBar,
    Widget,
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
        this.parseMissionOffersData(newData)
      },
    },
    'missionOffers.settings': {
      handler(newList, oldList) {
        this.filterMissionOffers(this.missionOffers.searchPhrase)
      },
      deep: true
    },

  },
  methods: {
    /**
     */
    parseMissionOffersData(gameData) {
      this.missionOffers.list = this.unifyMissions(gameData);
      this.missionOffers.filtered = this.missionOffers.list;
      this.filterMissionOffers(this.missionOffers.searchPhrase)
    },

    /**
     * Filter mission offers
     */
    filterMissionOffers(phrase) {
      this.missionOffers.searchPhrase = phrase.toLowerCase();
      // clone object without reference
      this.missionOffers.filtered = JSON.parse(JSON.stringify(this.missionOffers.list));
      for (const key in this.missionOffers.filtered) {
        let missionType = this.missionOffers.filtered[key];
        for (const missionTypeKey in missionType) {
          let missionGroup = missionType[missionTypeKey];
          for (const missionGroupKey in missionGroup.missions) {
            let mission = missionGroup.missions[missionGroupKey];
            let name = mission.hasOwnProperty('name') ? mission.name.toLowerCase() : null;
            let rewardtext = mission.hasOwnProperty('rewardtext') ? mission.rewardtext.toLowerCase() : null;
            if (
                !mission ||
                !name ||
                (!name.includes(this.missionOffers.searchPhrase) && !rewardtext.includes(this.missionOffers.searchPhrase)) ||
                this.missionOffers.settings.difficulties.some(element => {
                  return !element.enabled && element.index === mission.difficulty
                })
            ) {
              delete this.missionOffers.filtered[key][missionTypeKey].missions[missionGroupKey];
            }
          }
        }
      }
      this.missionOffers.filtered = this.removeEmptyAndDisabledMissionNodes(this.missionOffers.filtered)
    },
    /**
     * Unify missions object, so all objects have the same structure
     */
    unifyMissions(missionOffers) {
      Object.keys(missionOffers).forEach(key => {
        if (!missionOffers[key][0] || missionOffers[key][0].missions === undefined) {
          missionOffers[key] = [
            {
              id: key,
              name: null,
              missions: missionOffers[key],
            }
          ]
        }
      });

      return missionOffers;
    },
    /**
     * Remove empty and disabled nodes from mission offers object
     * @param missionOffers
     */
    removeEmptyAndDisabledMissionNodes(missionOffers) {
      for (const key in missionOffers) {
        let isEnabled = this.missionOffers.settings.types.some(element => {
          return element.name === key && element.enabled
        });

        let missionType = missionOffers[key];
        for (const missionTypeKey in missionType) {
          let missionGroup = missionType[missionTypeKey];
          if (!isEnabled || !missionGroup.missions) {
            delete missionOffers[key][missionTypeKey];
          }
        }
      }

      return missionOffers;
    },
    /**
     * Do not show empty groups
     * @param value
     * @return {boolean}
     */
    shouldShowMissionGroup(value) {
      return value !== '' && Object.keys(value).length > 0;
    },


  },
  computed: {
    /**
     * @return {*}
     */
    missionDifficultiesRules() {
      return this.missionOffers.settings.difficulties.filter((item => {
        return item.enabled;
      })).map(item => {
        return item.name.toLowerCase();
      });
    },
    /**
     * @return {*}
     */
    missionTypesRules() {
      return this.missionOffers.settings.types.filter((item => {
        return item.enabled;
      })).map(item => {
        return item.name.toLowerCase();
      });
    },
  },
  data() {
    return {
      missionOffers: {
        list: [],
        filtered: [],
        searchPhrase: '',
        settings: reactive(
            JSON.parse(localStorage.getItem("missionOffersSettings")) ||
            {
              difficulties: [
                {
                  index: 1,
                  name: 'trivial',
                  enabled: true
                },
                {
                  index: 2,
                  name: 'very easy',
                  enabled: true
                },
                {
                  index: 3,
                  name: 'easy',
                  enabled: true
                },
                {
                  index: 4,
                  name: 'medium',
                  enabled: true
                },
                {
                  index: 5,
                  name: 'hard',
                  enabled: true
                },
                {
                  index: 6,
                  name: 'very hard',
                  enabled: true
                },
              ],

              types: [
                {
                  name: 'plot',
                  enabled: true,
                },
                {
                  name: 'guild',
                  enabled: true,
                },
                {
                  name: 'other',
                  enabled: true,
                },
                {
                  name: 'coalition',
                  enabled: true,
                },
              ],

              descriptions: 0,
              objectives: false,
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