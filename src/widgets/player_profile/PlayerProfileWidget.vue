<template>
  <div class="card card-profile" :class="[ compact ? 'mt-1' : 'mt-4' ]">
    <div v-if="settings.showBanner" class="card-header x4-backgound"></div>
    <div class="card-body text-center resizable-element" :data-min-resizable-height="minResizableHeight">
      <img v-if="settings.showBanner" class="card-profile-img" src="../../assets/x4-logo.png" title="..."/>
      <div class="mb-2">
        <div class="settings-icon-wrapper">
          <font-awesome-icon class="cursor-pointer" :icon="`cogs`" data-bs-toggle="modal" data-bs-target="#factions-settings"/>
          <Modal id="factions-settings" :title="$t('app.widgets.player_profile.settings.title')" size="modal-lg">
            <PlayerProfileSettings />
          </Modal>
        </div>
        <h3 v-if="settings.showPlayerName" class="mb-0 text-gray-400">
          <span>{{ player.name }}</span>
        </h3>
        <div v-if="player.faction"><small>{{ player.faction }}</small></div>
      </div>
      <div class="mb-4">
        <div v-if="sectorString">{{ sectorString }}</div>
        <div>{{ player.credits }}</div>
      </div>
    </div>
  </div>
</template>

<script>

import Modal from "@/components/Modal.vue";
import PlayerProfileSettings from "@/widgets/player_profile/PlayerProfileSettings.vue";
import store from "./js/store";

export default {
  components: { PlayerProfileSettings, Modal },
  props: {
    gameData: Object,
    maxHeight: {
      type: Number,
      default: 40
    },
  },
  inject: ['compact'],
  data() {
    return {
      player: {
        name: null,
        faction: null,
        sectorname: null,
        sectorowner: null,
        credit: null,
      },
    }
  },
  /**
   */
  watch: {
    'gameData': {
      handler(newData, oldData) {
        this.parsePlayerProfileData(newData)
      },
    },
  },
  computed: {
    settings() {
      return store.state.settings;
    },
    sectorString() {
      if (!this.settings.showSectorName) {
        return null;
      }
      if (this.player.sectorowner && this.settings.showSectorOwner) {
        return this.player.sectorname + ' (' + this.player.sectorowner + ')';
      }
      return this.player.sectorname;
    },
    minResizableHeight() {
      let maxHeight = 190;
      if (!this.settings.showBanner) {
        maxHeight -= 50;
      }
      if (!this.settings.showPlayerName) {
        maxHeight -= 20;
      }
      if (!this.settings.showSectorName) {
        maxHeight -= 20;
      }
      return maxHeight;
    }
  },

  methods: {
    /**
     */
    parsePlayerProfileData(gameData) {
      this.player = {
        name: gameData.name,
        faction: gameData.factionname,
        sectorname: gameData.sectorname,
        sectorowner: gameData.sectorowner,
        credits: gameData.credits.toLocaleString() + ' ' + this.$t('app.common.credits'),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "./scss/widget.scss";

  .settings-icon-wrapper {
    display: flex;
    justify-content: flex-end;
  }

</style>