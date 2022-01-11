<link rel="stylesheet" href="../scss/user/_user.scss">
<template>
  <div class="d-flex align-items-stretch">
    <!-- Sidebar Navigation-->

    <div class="page-content form-page">
      <!-- Breadcrumb-->
      <breadcrumb v-if="!dataFetchError" />

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
                  <h4 class="card-title pb-3">Mission Offers</h4>
                  <search-bar @search="filterMissionOffers"/>
                </div>
                <div class="list-group">
                  <div class="list-group-item border-0 py-2 px-lg-4">
                    <div class="d-flex flex-column">
                      <div>
                        <button class="btn btn-sm btn-filter me-1 mb-1" type="submit" :class="{ active: isDifficultyBtnActive(1) }" @click="filterMissionDifficulty(1)">Trival</button>
                        <button class="btn btn-sm btn-filter me-1 mb-1" type="submit" :class="{ active: isDifficultyBtnActive(2) }" @click="filterMissionDifficulty(2)">Very Easy</button>
                        <button class="btn btn-sm btn-filter me-1 mb-1" type="submit" :class="{ active: isDifficultyBtnActive(3) }" @click="filterMissionDifficulty(3)">Easy</button>
                        <button class="btn btn-sm btn-filter me-1 mb-1" type="submit" :class="{ active: isDifficultyBtnActive(4) }" @click="filterMissionDifficulty(4)">Medium</button>
                        <button class="btn btn-sm btn-filter me-1 mb-1" type="submit" :class="{ active: isDifficultyBtnActive(5) }" @click="filterMissionDifficulty(5)">Hard</button>
                        <button class="btn btn-sm btn-filter me-1 mb-1" type="submit" :class="{ active: isDifficultyBtnActive(6) }" @click="filterMissionDifficulty(6)">Very Hard</button>
                      </div>
                      <div>
                        <div class="accordion pt-4">
                          <perfect-scrollbar :class="'ps-mission-offers'">
                            <div v-for="(value, group) in missionOffers.filtered">
                              <div v-if="shouldShowMissionGroup(value)">
                                <h4 class="text-capitalize">{{ group }}</h4>
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
                  <h4 class="card-title pb-3">Logbook</h4>
                  <search-bar @search="filterLogbook"/>
                </div>
                <div class="list-group-item border-start-0 border-end-0 border-bottom-0 py-2 px-lg-4">
                  <div class="d-flex flex-column">
                    <div class="">
                      <button class="btn btn-sm btn-filter me-1 mb-1" type="submit" :class="{ active: isLogbookBtnActive('police interdiction') }" @click="filterLogbookPhrases('police interdiction')">Police
                        interdiction
                      </button>
                      <button class="btn btn-sm btn-filter me-1 mb-1" type="submit" :class="{ active: isLogbookBtnActive('reputation gained') }" @click="filterLogbookPhrases('reputation gained')">Reputation gained
                      </button>
                      <button class="btn btn-sm btn-filter me-1 mb-1" type="submit" :class="{ active: isLogbookBtnActive('trade completed') }" @click="filterLogbookPhrases('trade completed')">Trade completed</button>
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

export default {
  components: { Breadcrumb, NoConnection, SearchBar, LogbookEntry, MissionOffers, ActiveMission, PlayerProfile },
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
        reward: null,
      },

      missionOffers: {
        list: [],
        filtered: [],
        searchPhrase: '',
        allowedDifficulties: [1, 2, 3, 4, 5, 6],
      },

      logbook: {
        list: [],
        filtered: [],
        searchPhrase: '',
        disallowedPhrases: [],
      },

      profile: [3, 2, 1],
      dataFetchError: false,
    }
  },
  watch: {
    appProfile(newValue, oldValue) {
      localStorage.setItem("appProfile", JSON.stringify(newValue));
      this.profile = newValue;
    }
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
              this.dataFetchError = false;

              this.parsePlayerProfileData(gameData)
              this.parseActiveMissionData(gameData)
              this.parseMissionOffersData(gameData)
              this.parseLogbookData(gameData)
            })
      } catch (e) {
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
      this.activeMission = {
        name: gameData.activemissions[1].name,
        description: gameData.activemissions[1].description,
        reward: gameData.activemissions[1].rewardtext,
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
                !this.missionOffers.allowedDifficulties.includes(mission.difficulty)
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
        if (
            value &&
            (
                (title.includes(this.logbook.searchPhrase) || text.includes(this.logbook.searchPhrase) || faction.includes(this.logbook.searchPhrase)) &&
                !this.logbook.disallowedPhrases.some(substring => {
                  return title.includes(substring) ||
                      title.includes(substring) ||
                      title.includes(substring)
                })
            )
        ) {
          filtered.push(value)
        }
      }
      this.logbook.filtered = filtered;
    },

    /**
     * @param difficulty
     */
    filterMissionDifficulty(difficulty) {
      this.isDifficultyBtnActive(difficulty) ? this.missionOffers.allowedDifficulties = this.missionOffers.allowedDifficulties.filter(e => e !== difficulty) : this.missionOffers.allowedDifficulties.push(difficulty);
      this.filterMissionOffers(this.missionOffers.searchPhrase)
    },

    /**
     * @param difficulty
     * @return {boolean}
     */
    isDifficultyBtnActive(difficulty) {
      return this.missionOffers.allowedDifficulties.includes(difficulty)
    },

    /**
     * @param excludedPhrase
     */
    filterLogbookPhrases(excludedPhrase) {
      !this.isLogbookBtnActive(excludedPhrase) ? this.logbook.disallowedPhrases = this.logbook.disallowedPhrases.filter(e => e !== excludedPhrase) : this.logbook.disallowedPhrases.push(excludedPhrase);
      this.filterLogbook(this.logbook.searchPhrase)
    },

    /**
     * @return {boolean}
     * @param {string} excludedPhrase
     */
    isLogbookBtnActive(excludedPhrase) {
      return !this.logbook.disallowedPhrases.includes(excludedPhrase)
    },

  },

  /**
   *
   */
  mounted() {
    this.profile = JSON.parse(localStorage.getItem("appProfile")) || []

    this.getData();
    setInterval(() => {
      this.getData();
    }, 2000)
  },

}
</script>

<style>
</style>