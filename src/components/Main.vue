<link rel="stylesheet" href="../scss/user/_user.scss">
<template>
  <div class="d-flex align-items-stretch">
    <!-- Sidebar Navigation-->
    <div class="page-content form-page">
      <!-- Breadcrumb-->
      <breadcrumb v-if="!dataFetchError"/>

      <section class="pt-0 pb-1">
        <div class="container-fluid">

          <no-connection v-if="dataFetchError"/>

          <div class="row gy-4" v-if="!dataFetchError">
            <!-- First column (player profile / active mission) -->
            <div :class="`order-${this.profile[0]}`" class="col-lg-3 app-column-1  d-flex flex-column">
              <player-profile :player="player"/>
              <active-mission :activeMission="activeMission" v-if="!dataFetchError"/>
            </div>

            <!-- Second column (mission offers) -->
            <div :class="`order-${this.profile[1]}`" class="col-lg-4 app-column-2 ">
              <div class="card">
                <div class="card-header">
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
                </div>
                <div class="list-group">
                  <div class="list-group-item border-0 py-2 px-lg-4">
                    <div class="d-flex flex-column">
                      <div>

                        <div class="overflow-hidden" style="height: 50px">
                      <span v-if="!missionDifficultiesRules">
                        <span class="badge bg-secondary">Adjust mission offers settings using <font-awesome-icon :icon="`cogs`"/> icon above.</span>
                      </span>
                          <span class="rules-string d-inline" v-if="missionDifficultiesRules">
                        <span class="badge bg-primary me-1">Difficulties</span>
                          <span v-for="value in missionDifficultiesRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                      </span>
                        </div>

                      </div>
                      <div>
                        <div class="accordion pt-2">
                          <perfect-scrollbar :class="'ps-mission-offers'">
                            <div v-for="(value, group) in missionOffers.filtered">
                              <div v-if="shouldShowMissionGroup(value)">

                                <mission-offers
                                    v-for="(value, name) in value"
                                    :group="group"
                                    :name="name"
                                    :value="value"/>
                              </div>
                            </div>
                          </perfect-scrollbar>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Third column (logbook) -->
            <div :class="`order-${this.profile[2]}`" class="col-lg-5 app-column-3 ">
              <div class="card">
                <div class="card-header">
                  <div class="d-flex justify-content-between">
                    <div><h4 class="card-title pb-3">Logbook</h4></div>
                    <div>
                      <font-awesome-icon class="cursor-pointer" :icon="`cogs`" data-bs-toggle="modal" data-bs-target="#logbook-setings"/>
                      <Modal id="logbook-setings" title="Logbook settings" size="modal-lg">
                        <LogbookSettings :settings="logbook.settings"/>
                      </Modal>
                    </div>
                  </div>

                  <search-bar @search="filterLogbook"/>
                </div>
                <div class="list-group-item border-start-0 border-end-0 border-bottom-0 py-2 px-lg-4">
                  <div class="d-flex flex-column">
                    <div class="overflow-hidden" style="height: 50px">
                      <span v-if="logbookExcludedRules.length<=0 && logbookFeaturedRules.length<=0">
                        <span class="badge bg-secondary">Adjust logbook settings using <font-awesome-icon :icon="`cogs`"/> icon above.</span>
                      </span>
                      <span class="rules-string d-inline" v-if="logbookExcludedRules.length>0">
                        <span class="badge bg-primary me-1">Excluded</span>
                        <span v-for="value in logbookExcludedRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                      </span>
                      <span class="rules-string d-inline" v-if="logbookFeaturedRules.length>0">
                        <span class="badge bg-primary me-1">Featured</span>
                        <span v-for="value in logbookFeaturedRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                      </span>
                    </div>
                    <div class="logbook">
                      <perfect-scrollbar :class="'ps-logbook'">
                        <logbook-entry
                            v-for="(entry, name) in logbook.filtered"
                            :name="name"
                            :entry="entry"/>
                      </perfect-scrollbar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>

import PlayerProfile from './PlayerProfile.vue'
import ActiveMission from "./ActiveMission.vue";
import MissionOffers from "./MissionOffersGroup.vue";
import LogbookEntry from "./LogbookEntry.vue";
import SearchBar from "./SearchBar.vue";
import NoConnection from "./NoConnection.vue";
import Breadcrumb from "./Breadcrumb.vue";
import Modal from "./Modal.vue";
import LogbookSettings from "./LogbookSettings.vue";
import MissionOffersSettings from "./MissionOffersSettings.vue";
import {reactive} from "vue";

export default {
  components: { MissionOffersSettings, LogbookSettings, Modal, Breadcrumb, NoConnection, SearchBar, LogbookEntry, MissionOffers, ActiveMission, PlayerProfile },
  emits: [
    'updatePending'
  ],
  props: [
    'appProfile'
  ],
  data() {
    return {
      player: {
        name: null,
        faction: null,
        sector: null,
        credit: null,
      },

      activeMission: {
        name: null,
        description: null,
        rewardtext: null,
        reward: null,
      },

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
              ]
            }
        ),
      },

      logbook: {
        list: [],
        filtered: [],
        searchPhrase: '',
        settings: reactive(
            JSON.parse(localStorage.getItem("logbookSettings")) || {
              rules: []
            }
        ),
      },

      profile: [3, 2, 1],
      dataFetchError: false,
    }
  },
  computed: {
    /**
     * @return {*}
     */
    logbookExcludedRules() {
      return this.logbook.settings.rules.filter((item => {
        return item.type === 'excluded' && item.phrase !== '';
      })).map(item => {
        return item.phrase.toLowerCase();
      });
    },

    /**
     * @return {*}
     */
    logbookFeaturedRules() {
      return this.logbook.settings.rules.filter((item => {
        return item.type === 'featured' && item.phrase !== '';
      })).map(item => {
        return item.phrase.toLowerCase();
      });
    },
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
  },
  /**
   */
  watch: {
    appProfile(newValue, oldValue) {
      localStorage.setItem("appProfile", JSON.stringify(newValue));
      this.profile = newValue;
    },
    'logbook.settings': {
      handler(newList, oldList) {
        this.filterLogbook(this.logbook.searchPhrase)
      },
      deep: true
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
    async getData() {
      try {
        await fetch(`/api/data`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }).then(response => response.text())
            .then((response) => {
              let gameData = JSON.parse(response);
              this.$emit('updatePending', gameData.updatePending)

              this.dataFetchError = false;

              this.parsePlayerProfileData(gameData)
              this.parseActiveMissionData(gameData)
              this.parseMissionOffersData(gameData)
              this.parseLogbookData(gameData)
            })
      } catch (e) {
        if (process.env.NODE_ENV || 'development') {
          console.log(e)
        }
        this.dataFetchError = true;
      }
    },

    /**
     */
    parsePlayerProfileData(gameData) {
      this.player = {
        name: gameData.name,
        faction: gameData.factionname,
        sector: gameData.playersector,
        credits: gameData.credits.toLocaleString() + ' Cr',
      }
    },

    /**
     */
    parseActiveMissionData(gameData) {
      this.activeMission = {};
      if (gameData.activemissions !== "") {
        this.activeMission = {
          name: gameData.activemissions[1].name,
          description: gameData.activemissions[1].description,
          reward: gameData.activemissions[1].reward,
          rewardtext: gameData.activemissions[1].rewardtext,
        }
      }
    },

    /**
     */
    parseMissionOffersData(gameData) {
      this.missionOffers.list = this.unifyMissions(gameData.missionOffers);
      this.missionOffers.filtered = this.missionOffers.list;
      this.filterMissionOffers(this.missionOffers.searchPhrase)
    },

    /**
     *
     */
    parseLogbookData(gameData) {
      this.logbook.list = gameData.logbook;
      this.logbook.filtered = this.logbook.list;
      this.filterLogbook(this.logbook.searchPhrase)
    },

    /**
     * Unify missions object
     */
    unifyMissions(missionOffers) {
      Object.keys(missionOffers).forEach(key => {
        if (missionOffers[key][1] && missionOffers[key][1].missions === undefined) {
          missionOffers[key] = {
            "": {
              id: key,
              name: 'Missions',
              missions: missionOffers[key],
            }
          }
        }
      });

      return missionOffers;
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
            let name = mission.name.toLowerCase();
            let rewardtext = mission.rewardtext.toLowerCase();
            if (
                !mission ||
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
      this.missionOffers.filtered = this.removeEmptyMissionNodes(this.missionOffers.filtered)
    },

    /**
     * Remove empty nodes from mission offers object
     * @param missionOffers
     */
    removeEmptyMissionNodes(missionOffers) {
      for (const key in missionOffers) {
        let missionType = missionOffers[key];
        for (const missionTypeKey in missionType) {
          let missionGroup = missionType[missionTypeKey];
          if (Object.keys(missionGroup.missions).length === 0) {
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

    /**
     * Filter logbook
     */
    filterLogbook(phrase) {
      this.logbook.searchPhrase = phrase.toLowerCase();
      let filtered = [];
      this.logbook.filtered = this.logbook.list;
      for (const key in this.logbook.list) {
        let value = this.logbook.filtered[key];
        let title = value.title.toLowerCase();
        let text = value.text.toLowerCase();
        let faction = value.factionname.toLowerCase();

        value.rules = null;
        // apply rules
        this.logbook.settings.rules.some(element => {
          let elementPhrase = element.phrase.toLowerCase();
          if (
              element.enabled &&
              elementPhrase !== '' && (
                  title.includes(elementPhrase) ||
                  !element.params.titleonly &&
                  (
                      text.includes(elementPhrase) ||
                      faction.includes(elementPhrase)
                  )
              )
          ) {
            value.rules = element;
            return true;
          }
        });

        if (
            value &&
            (
                (title.includes(this.logbook.searchPhrase) || text.includes(this.logbook.searchPhrase) || faction.includes(this.logbook.searchPhrase)) &&
                (
                    !value.rules ||
                    value.rules.type !== 'excluded'
                )
            )
        ) {

          filtered.push(value)
        }
      }
      this.logbook.filtered = filtered;
    },

  },

  /**
   *
   */
  mounted() {
    let dataFetchInterval = 2000;
    this.profile = JSON.parse(localStorage.getItem("appProfile")) || []

    this.getData();
    setInterval(() => {
      this.getData();
    }, dataFetchInterval)
  },

}
</script>

<style>
</style>