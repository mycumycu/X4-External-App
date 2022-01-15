<template>
  <div class="ps-2 py-2">
    <div class="d-flex justify-content-between align-items-start">
      <h6 class="title my-0">{{ missionValue.name }}</h6>
      <div class="badge bg-dark">{{ ['trival', 'very easy', 'easy', 'medium', 'hard', 'very hard'][missionValue.difficulty - 1] }}</div>
    </div>
    <div class="text-muted text-xs" v-html="missionValue.rewardtext"></div>
    <div class="text-muted text-xs" v-if="missionValue.reward">
      <font-awesome-icon :icon="'coins'" :class="`fa-icon`"/>
      {{ `${missionValue.reward.toLocaleString()} Cr` }}
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'missionValue',
    'i',
  ],
  data() {
    return {}
  },
}
</script>

<style>
</style>