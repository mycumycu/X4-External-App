<template>
  <h6 class="mt-2 mb-2">{{ $t('app.widgets.factions.settings.exclude') }} <small class="font-weight-light">{{ $t('app.widgets.factions.settings.comma_separated') }}</small></h6>
  <div class="row">
    <div class="col-sm-10 offset-2">
      <input type="text" class="form-select" v-model="settings.excludedFactions" :placeholder="$t('app.widgets.factions.settings.placeholder')"/>
    </div>
  </div>

  <h6 class="mt-4 mb-2">{{ $t('app.widgets.factions.settings.relation_level') }}</h6>
  <div class="row">
    <template v-for="(element, listIndex) in settings.relationLevels" :key="listIndex">
      <div class="col-3 mb-2 text-end">
        <Toggle
            v-model="element.enabled"
            :onLabel="$t('app.common.on')"
            :offLabel="$t('app.common.off')"/>
      </div>
      <div class="col-3 mb-2" :class="{'disabled': !element.enabled}">
        <span class="badge bg-primary relation-level">{{ $t('app.widgets.factions.relation_levels.' + element.name) }} <span>({{ $t('app.widgets.factions.settings.from_to', { min: element.min, max: element.max }) }})</span></span>
      </div>
    </template>
  </div>
  <h6 class="mt-4 mb-2">{{ $t('app.widgets.factions.settings.other') }}</h6>
  <div class="row">
    <div class="col-3 mb-2 text-end">
      <Toggle
          v-model="settings.showRelationChanges"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"/>
    </div>
    <div class="col-9 mb-2">
      {{ $t('app.widgets.factions.settings.show_relation_changes') }}
    </div>
  </div>
  <div class="row">
    <div class="col-3 mb-2 text-end">
      <Toggle
          v-model="settings.showLicenceIndicators"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"/>
    </div>
    <div class="col-9 mb-2">
      {{ $t('app.widgets.factions.settings.show_licence_indicators') }}
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
