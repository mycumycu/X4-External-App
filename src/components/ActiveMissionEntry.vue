<template>
  <div>
    <h5 class="text-muted mb-2">{{ mission.name }}</h5>
    <p class="text-small mb-0" v-html="mission.description"></p>
    <div class="text-small mb-0" v-if="mission.reward || mission.rewardtext ">
      <div class="mt-2"><strong>Reward</strong></div>
      <div class="text-muted text-xs" v-if="mission.reward > 0">
        <font-awesome-icon :icon="'coins'" :class="`fa-icon`"/>
        {{ mission.reward.toLocaleString() }} Cr
      </div>
      <div class="text-muted text-xs" v-if="mission.rewardtext" v-html="mission.rewardtext"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'mission'
  ],
  data() {
    return {}
  },
  methods: {}
}
</script>

<style>
</style>