<template>
  <div>
    <h5 class="text-muted">{{ mission.name }}</h5>
    <ol>
      <li v-for="briefing in mission.briefings">
        <h6 :class="{'text-muted': !briefing.active}">{{ briefing.text }}</h6>
      </li>
    </ol>
    <p class="text-small mt-4 mb-0" v-html="mission.description"></p>
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
  /**
   * @returns {{}}
   */
  data() {
    return {}
  },
  /**
   */
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>