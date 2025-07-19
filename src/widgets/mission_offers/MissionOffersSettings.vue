<template>
  <perfect-scrollbar class="mission-offers-settings-scroll">
    <div class="ms-4 me-3">
      <form>
        <h6 class="mb-4">{{ $t('app.widgets.mission_offers.difficulties') }}</h6>
        <div class="row">
          <template v-for="(element, listIndex) in settings.difficulties" :key="listIndex">
            <div class="col-3 mb-2 text-end">
              <Toggle
                  v-model="element.enabled"
                  :onLabel="$t('app.common.on')"
                  :offLabel="$t('app.common.off')"/>
            </div>
            <div class="col-3 mb-2" :class="{'disabled': !element.enabled}">
              <span class="badge bg-primary">{{ $t('app.widgets.mission_offers.difficulty_levels.' + snakeCase(element.name)) }}</span>
            </div>
          </template>
        </div>
        <hr/>
        <h6 class="mb-4">{{ $t('app.widgets.mission_offers.types') }}</h6>
        <div class="row">
          <template v-for="(element, typeIndex) in settings.types" :key="typeIndex">
            <div class="col-3 mb-2 text-end">
              <Toggle
                  v-model="element.enabled"
                  :onLabel="$t('app.common.on')"
                  :offLabel="$t('app.common.off')"/>
            </div>
            <div class="col-3 mb-2" :class="{'disabled': !element.enabled}">
              <span class="badge bg-primary">{{ $t('app.widgets.mission_offers.mission_types.' + snakeCase(element.name)) }}</span>
            </div>
          </template>
        </div>
        <hr/>
        <h6 class="mb-4">{{ $t('app.widgets.mission_offers.other_settings') }}</h6>
        <div class="row mb-2">
          <div class="col-sm-5 p-1 caption">{{ $t('app.widgets.mission_offers.mission_descriptions') }}</div>
          <div class="col-sm-7">
            <select class="form-select" v-model="settings.descriptions">
              <option :value="option.key" v-for="option in descriptionOptions" :key="option.key">{{ option.value }}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-5 p-1 caption">{{ $t('app.widgets.mission_offers.mission_objectives') }}</div>
          <div class="col-sm-7">
            <Toggle
                v-model="settings.objectives"
                :onLabel="$t('app.common.on')"
                :offLabel="$t('app.common.off')"/>
          </div>
        </div>
      </form>
    </div>
  </perfect-scrollbar>
</template>

<script>
import Toggle from '@vueform/toggle'
import missionOffersStore from './js/missionOffersStore'
import { snakeCase } from 'lodash'

export default {
  components: {
    Toggle,
  },
  data() {
    return {
      value: false,
      settings: missionOffersStore.state.settings
    }
  },
  computed: {
    descriptionOptions() {
      return [
        {
          key: 0,
          value: this.$t('app.common.disabled'),
        },
        {
          key: 50,
          value: this.$t('app.widgets.mission_offers.show_first_chars', { count: 50 }),
        },
        {
          key: 100,
          value: this.$t('app.widgets.mission_offers.show_first_chars', { count: 100 }),
        },
        {
          key: 150,
          value: this.$t('app.widgets.mission_offers.show_first_chars', { count: 150 }),
        },
        {
          key: 200,
          value: this.$t('app.widgets.mission_offers.show_first_chars', { count: 200 }),
        },
        {
          key: 300,
          value: this.$t('app.widgets.mission_offers.show_first_chars', { count: 300 }),
        },
        {
          key: 999999,
          value: this.$t('app.common.enabled'),
        },
      ];
    }
  },
  /**
   */
  watch: {
    settings: {
      handler(newList, oldList) {
        localStorage.setItem("missionOffersSettings", JSON.stringify(newList));
      },
      deep: true
    },
  },
  /**
   */
  methods: { snakeCase },
}
</script>

<style lang="scss" scoped>
@import "./scss/settings.scss";
</style>
