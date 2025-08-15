<template>
  <div class="row">
    <div class="col-sm-6 d-flex gap-3 mb-2">
      <Toggle
          v-model="showBanner"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"/>
      <div :class="{'disabled': !showBanner}">
        {{ $t('app.widgets.player_profile.settings.show_widget_banner') }}
      </div>
    </div>
    <div class="col-sm-6 d-flex gap-3 mb-2">
      <Toggle
          v-model="showSectorName"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"/>
      <div :class="{'disabled': !showSectorName}">
        {{ $t('app.widgets.player_profile.settings.show_sector_name') }}
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-6 d-flex gap-3 mb-2">
      <Toggle
          v-model="showPlayerName"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"/>
      <div :class="{'disabled': !showPlayerName}">
        {{ $t('app.widgets.player_profile.settings.show_player_name') }}
      </div>
    </div>
    <div class="col-sm-6 d-flex gap-3 mb-2">
      <Toggle
          v-model="showSectorOwner"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"/>
      <div :class="{'disabled': !showSectorOwner}">
        {{ $t('app.widgets.player_profile.settings.show_sector_owner') }}
      </div>
    </div>
  </div>
</template>

<script>
import Toggle from '@vueform/toggle'
import store from "./js/store";

export default {
  components: {
    Toggle,
  },
  emits: ['resizeWidgets'],
  computed: {
    showPlayerName: {
      get () {
        return store.state.settings.showPlayerName
      },
      set (v) {
        store.commit('updateSettings', { ...store.state.settings, showPlayerName: v })
      }
    },
    showBanner: {
      get () {
        return store.state.settings.showBanner
      },
      set (v) {
        store.commit('updateSettings', { ...store.state.settings, showBanner: v })
        this.emitter.emit('resizeWidgets')
      }
    },
    showSectorName: {
      get () {
        return store.state.settings.showSectorName
      },
      set (v) {
        store.commit('updateSettings', { ...store.state.settings, showSectorName: v })
        if (!v) {
          store.commit('updateSettings', { ...store.state.settings, showSectorOwner: v })
        }
      }
    },
    showSectorOwner: {
      get () {
        return store.state.settings.showSectorOwner
      },
      set (v) {
        store.commit('updateSettings', { ...store.state.settings, showSectorOwner: v })
        if (v) {
          store.commit('updateSettings', { ...store.state.settings, showSectorName: v })
        }
      }
    }
  },
  /**
   */
  methods: {},
}
</script>

<style lang="scss" scoped>
@import "./scss/settings.scss";
</style>
