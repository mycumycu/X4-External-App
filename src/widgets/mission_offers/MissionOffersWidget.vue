<template>
  <widget>
    <template #header>
      <div class="d-flex justify-content-between">
        <div><h4 class="card-title pb-3">{{ $t('app.widgets.mission_offers.title') }}</h4></div>
        <div>
          <font-awesome-icon :icon="`cogs`" class="cursor-pointer" data-bs-toggle="modal" data-bs-target="#mission-offers-setings"/>
          <Modal id="mission-offers-setings" :title="$t('app.widgets.mission_offers.settings_title')" size="modal-md">
            <MissionOffersSettings />
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
                      <span v-if="!missionDifficultiesRules.length && !missionTypesRules.length">
                        <span class="badge bg-dark text-muted">
                          <I18nT keypath="app.widgets.mission_offers.adjust_settings">
                            <template #icon><font-awesome-icon :icon="`cogs`" /></template>
                          </I18nT>
                        </span>
                      </span>
              <span class="rules-string d-inline" v-if="missionDifficultiesRules.length > 0 ">
                        <span class="badge bg-primary me-1">{{ $t('app.widgets.mission_offers.difficulties') }}</span>
                          <span v-for="value in missionDifficultiesRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                      </span>
              <span class="rules-string d-inline" v-if="missionTypesRules.length > 0 ">
                        <span class="badge bg-primary me-1">{{ $t('app.widgets.mission_offers.types') }}</span>
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
                        :group-name="getMissionTypeName(group)"
                        :name="name"
                        :value="value"
                        :settings="missionOffersStore.state.settings"/>
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
import missionOffersStore from "./js/missionOffersStore";
import widgetMixins from './js/mixins';
import { I18nT } from "vue-i18n";

export default {
  mixins: [widgetMixins],
  components: {
    I18nT,
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
    'missionOffersStore.state.settings': {
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
                this.missionOffersStore.state.settings.difficulties.some(element => {
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
        let isEnabled = this.missionOffersStore.state.settings.types.some(element => {
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
      return this.missionOffersStore.state.settings.difficulties.filter((item => {
        return item.enabled;
      })).map(item => {
        return this.getMissionDifficultyName(item.name);
      });
    },
    /**
     * @return {*}
     */
    missionTypesRules() {
      return this.missionOffersStore.state.settings.types.filter((item => {
        return item.enabled;
      })).map(item => {
        return this.getMissionTypeName(item.name);
      });
    },
  },
  data() {
    return {
      missionOffersStore,
      missionOffers: {
        list: [],
        filtered: [],
        searchPhrase: '',
      },
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "./scss/widget.scss";
</style>
