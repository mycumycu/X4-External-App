<template>
  <div v-if="missionValue!==undefined" class="ps-2 py-2">
    <div class="d-flex justify-content-between align-items-start">
      <h6 class="title my-0">{{ missionNameCleaned }}</h6>
      <div class="badge bg-dark">{{ ['trival', 'very easy', 'easy', 'medium', 'hard', 'very hard'][missionValue.difficulty - 1] }}</div>
    </div>
    <div class="small" v-html="$filters.str_limit(missionDescriptionCleaned, settings.descriptions)" :title="missionDescriptionCleaned" />
    <div class="d-flex" v-if="missionValue.rewardtext">
      <font-awesome-icon :icon="'star'" class="fa-icon text-xs star-icon" v-if="hasDescriptions"/>
      <div class="text-muted text-xs" :class="{'ms-1': hasDescriptions}" v-html="missionValue.rewardtext" />
    </div>
    <ol v-if="settings.objectives">
      <li v-for="objective in missionValue.briefingobjectives" class="text-muted text-xs">{{ objective.text }}</li>
    </ol>
    <div class="d-flex justify-content-between text-muted text-xs">
      <div>
        <div v-if="missionValue.reward">
          <font-awesome-icon :icon="'coins'" class="fa-icon"/>
          {{ `${missionValue.reward.toLocaleString()} Cr` }}
        </div>
        <div v-if="hasDuration">
          <font-awesome-icon :icon="'clock'" class="fa-icon"/>
          {{ duration }}
        </div>
      </div>
      <div v-if="missionValue.factionname">
        <font-awesome-icon :icon="'user-friends'" :class="`fa-icon`"/>
        {{ missionValue.factionname }}
      </div>
    </div>
  </div>
</template>

<script>
import Helper from '../../helper'

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
    hasDescriptions () {
      return this.settings.descriptions !== 0;
    },
    missionNameCleaned () {
      return this.stripFactory(this.missionValue.name);
    },
    missionDescriptionCleaned () {
      return this.stripFactory(this.missionValue.description);
    },
    hasDuration () {
      return this.missionValue.duration !== 0;
    },
    duration () {
      return Helper.formatTime(this.missionValue.duration);
    }
  },
  methods: {
    /**
     * @param text
     * @returns {*}
     */
    stripFactory (text) {
      return this.stripColorCodes(
          this.stripHtml(text)
      );
    },
    /**
     * Removes HTML tags from text
     *
     * @param text
     * @returns {*}
     */
    stripHtml (text) {
      return text.replace(/<[^>]*>?/gm, '')
    },
    /**
     * Removes color codes added by Colourized Faction Texts mod
     * https://github.com/mycumycu/X4-External-App/issues/7
     *
     * @param text
     * @returns {*}
     */
    stripColorCodes (text) {
      return text.replace(/(#[^#]*#?)/gm, '');
    }
  },
  data () {
    return {}
  },
}
</script>

<style lang="scss" scoped>
@import "./scss/widget.scss";

.star-icon {
  margin-top: 3px;
}
</style>