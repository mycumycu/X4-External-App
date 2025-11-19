<template>
  <div class="row">
    <div class="col-sm-6">
      <div class="d-flex gap-3 mb-2">
        <Toggle
          v-model="settings.showAgentImage"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"
        />
        <div :class="{ 'disabled': !settings.showAgentImage }">
          {{ $t('app.widgets.agents.settings.show_agent_image') }}
        </div>
      </div>
      <div class="d-flex gap-3 mb-2">
        <Toggle
          v-model="settings.showAgentDetails"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"
        />
        <div :class="{ 'disabled': !settings.showAgentDetails }">
          {{ $t('app.widgets.agents.settings.show_agent_details') }}
        </div>
      </div>
    </div>
    <div class="col-sm-6">
      <div class="d-flex gap-3 mb-2">
        <Toggle
          v-model="settings.showMissionDetails"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"
        />
        <div :class="{ 'disabled': !settings.showMissionDetails }">
          {{ $t('app.widgets.agents.settings.show_mission_details') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toggle from '@vueform/toggle';

export default {
  name: 'AgentsSettings',
  components: {
    Toggle,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  watch: {
    settings: {
      handler(newSettings) {
        localStorage.setItem('agentsSettings', JSON.stringify(newSettings));
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./scss/settings.scss";
</style>

