<template>
  <div class="row">
    <div class="col d-flex gap-3">
      <Toggle
          v-model="settings.enableLongTerm"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"/>
      <div :class="{'disabled': !settings.enableLongTerm}">
        {{ $t('app.widgets.player_goals.split_list') }}
      </div>

    </div>
  </div>
</template>

<script>
import Toggle from '@vueform/toggle'
import GoalsStore from "./js/playerGoalsStore.js";

export default {
  components: {
    Toggle,
  },
  props: ['settings'],
  data() {
    return {
      value: false,
    }
  },
  /**
   */
  watch: {
    settings: {
      handler(newList, oldList) {
        if (!newList.enableLongTerm) {
          GoalsStore.commit('mergeLists')
        }
        localStorage.setItem("playerGoalsSettings", JSON.stringify(newList));
      },
      deep: true
    },
  },
  /**
   */
  methods: {},
}
</script>

<style lang="scss" scoped>
@import "./scss/settings.scss";
</style>
