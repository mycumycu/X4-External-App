<template>
  <div class="row">
    <div class="col d-flex gap-3">
      <Toggle
          v-model="settings.enableLongTerm"
          onLabel="on"
          offLabel="off"/>
      <div :class="{'disabled': !settings.enableLongTerm}">
        Split list to a short and long term
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

<style src="../../../node_modules/@vueform/toggle/themes/default.css"></style>
<style lang="scss">
.disabled {
  opacity: 0.5;
}
</style>