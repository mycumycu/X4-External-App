<template>
  <div class="ps-2 py-2">
    <div class="d-flex justify-content-between align-items-start">
      <h6 class="title my-0">{{ missionValue.name }}</h6>
      <div class="badge bg-dark">{{ ['trival', 'very easy', 'easy', 'medium', 'hard', 'very hard'][missionValue.difficulty - 1] }}</div>
    </div>
    <div class="small" v-html="$filters.str_limit(missionValue.description, settings.descriptions)" :title="title(missionValue.description)"></div>
    <div class="d-flex" v-if="missionValue.rewardtext">
      <font-awesome-icon :icon="'star'" class="fa-icon text-xs star-icon" v-if="hasDescriptions"/>
      <div class="text-muted text-xs" :class="{'ms-1': hasDescriptions}" v-html="missionValue.rewardtext"></div>
    </div>
    <div class="text-muted text-xs" v-if="missionValue.reward">
      <font-awesome-icon :icon="'coins'" class="fa-icon"/>
      {{ `${missionValue.reward.toLocaleString()} Cr` }}
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'settings',
    'missionValue',
    'i',
  ],
  computed: {
    /**
     * @returns {boolean}
     */
    hasDescriptions() {
      return this.settings.descriptions !== 0;
    }
  },
  methods: {
    /**
     * Removes HTML tags from text
     *
     * @param text
     * @returns {*}
     */
    title(text) {
      return text.replace(/<[^>]*>?/gm, '')
    }
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss">
.star-icon {
  margin-top: 3px;
}
</style>