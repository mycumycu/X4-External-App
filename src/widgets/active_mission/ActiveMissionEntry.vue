<template>
  <div>
    <h5 class="text-muted">{{ mission.name }}</h5>
    <ol>
      <li v-for="briefing in mission.briefings">
        <h6 :class="{'text-muted': !briefing.active, 'fw-normal completed': briefing.completed}">{{ briefing.text }}
          <span v-if="briefing.completed"> - completed</span>
        </h6>
      </li>
    </ol>
    <p class="text-small mt-4 mb-0" v-html="mission.description"></p>
    <div class="d-flex justify-content-between">
      <div class="text-small mb-0" style="flex-basis: 70%">
        <div v-if="mission.reward || mission.rewardtext">
          <div class="mt-2"><strong>Reward</strong></div>
          <div class="text-muted text-xs" v-if="mission.reward > 0">
            <font-awesome-icon :icon="'coins'" :class="`fa-icon`"/>
            {{ mission.reward.toLocaleString() }} Cr
          </div>
        </div>
        <div class="text-muted text-xs" v-if="mission.rewardtext" v-html="mission.rewardtext"/>
      </div>
      <div v-if="hasTimeout">
        <div class="mt-2"><strong>Time Left</strong></div>
        <font-awesome-icon :icon="'clock'" :class="`fa-icon`"/>
        <span class="text-muted text-xs ms-1">{{ timeout }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Helper from '../../helper'

export default {
  props: [
    'mission'
  ],
  /**
   * @returns {{}}
   */
  data () {
    return {}
  },
  computed: {
    hasTimeout () {
      return this.mission.timeout !== 0;
    },
    timeout () {
      return Helper.formatTime(this.mission.timeout);
    }
  },
  /**
   */
  methods: {}
}
</script>

<style lang="scss" scoped>
.completed {
  color: #666 !important;
}
</style>