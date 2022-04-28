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
            <div :class="`order-${this.appViewProfile[0]}`" class="col-lg-3 app-column-1 d-flex flex-column">
              <player-profile :gameData="gameData.player"/>
              <active-mission :gameData="gameData.activeMissions"/>
            </div>

            <!-- Second column (mission offers) -->
            <div :class="`order-${this.appViewProfile[1]}`" class="col-lg-4 col-md-6 app-column-2 ">
              <mission-offers :gameData="gameData.missionOffers"/>
            </div>

            <!-- Third column (logbook) -->
            <div :class="`order-${this.appViewProfile[2]}`" class="col-lg-5 col-md-6 app-column-3 ">
              <logbook :gameData="gameData.logbook"/>
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
import MissionOffers from "./MissionOffers.vue";
import Logbook from "./Logbook.vue";
import SearchBar from "./SearchBar.vue";
import NoConnection from "./NoConnection.vue";
import Breadcrumb from "./Breadcrumb.vue";

export default {
  components: { Logbook, Breadcrumb, NoConnection, SearchBar, MissionOffers, ActiveMission, PlayerProfile },
  emits: [
    'updatePending'
  ],
  props: [
    'appProfile'
  ],
  data() {
    return {

      gameData: {
        player: null,
        activeMissions: null,
        missionOffers: null,
        logbook: null,
      },

      appViewProfile: [],
      dataFetchError: false,
    }
  },
  computed: {
    //
  },
  /**
   */
  watch: {
    'appProfile': {
      handler(newValue, oldValue) {
        localStorage.setItem("appProfile", JSON.stringify(newValue));
        this.appViewProfile = newValue;
      },
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
              if (gameData) {
                this.gameData = gameData;
                this.$emit('updatePending', gameData.updatePending)

                this.dataFetchError = false;
              }
              else this.dataFetchError = true;
            })
      } catch (e) {
        if (process.env.NODE_ENV || 'development') {
          console.log(e)
        }
        this.dataFetchError = true;
      }
    },
  },

  /**
   *
   */
  mounted() {
    let dataFetchInterval = 2000;
    this.appViewProfile = JSON.parse(localStorage.getItem("appProfile")) || []

    this.getData();
    setInterval(() => {
      this.getData();
    }, dataFetchInterval)
  },

}
</script>

<style>
</style>