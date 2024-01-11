<template>
  <h6 class="mt-2 mb-2">Exclude factions from list <small class="font-weight-light">(comma sepparated)</small></h6>
  <div class="row">
    <div class="col-sm-10 offset-2">
      <input type="text" class="form-select" v-model="settings.excludedFactions" placeholder="E.g. ARG, KHK, ZYA "/>
    </div>
  </div>

  <h6 class="mt-4 mb-2">Show only factions with relation level</h6>
  <div class="row">
    <template v-for="(element, listIndex) in settings.relationLevels" :key="listIndex">
      <div class="col-3 mb-2 text-end">
        <Toggle
            v-model="element.enabled"
            onLabel="on"
            offLabel="off"/>
      </div>
      <div class="col-3 mb-2" :class="{'disabled': !element.enabled}">
        <span class="badge bg-primary relation-level">{{ element.name }} <span>(from {{ element.min }} to {{ element.max }})</span></span>
      </div>
    </template>
  </div>
  <h6 class="mt-4 mb-2">Other</h6>
  <div class="row">
    <div class="col-3 mb-2 text-end">
      <Toggle
          v-model="settings.showRelationChanges"
          onLabel="on"
          offLabel="off"/>
    </div>
    <div class="col-9 mb-2">
      Show recent relation changes
    </div>
  </div>
  <div class="row">
    <div class="col-3 mb-2 text-end">
      <Toggle
          v-model="settings.showLicenceIndicators"
          onLabel="on"
          offLabel="off"/>
    </div>
    <div class="col-9 mb-2">
      Show military and capital licence indicators
    </div>
  </div>
</template>

<script>
import Toggle from '@vueform/toggle'

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
      handler(newSettings, oldSettings) {
        localStorage.setItem("factionsSettings", JSON.stringify(newSettings));
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