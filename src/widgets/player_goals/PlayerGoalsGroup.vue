<template>
  <h6 :class="goals[listKey].length === 0?'empty':null">{{ label }}</h6>
  <draggable
      item-key="id"
      class="list-group"
      :animation="150"
      :component-data="{
          tag: 'ul',
          name: !drag ? 'flip-lists' : null
      }"
      v-model="goals[listKey]"
      v-bind="dragOptions"
      @start="onStart"
      @end="onEnd">
    <template #item="{ element }" :key="element.id">
      <player-goals-row
          :listKey="listKey"
          :element="element"
      />
    </template>

    <template #footer v-if="splitList && goals[listKey].length === 0">
      <li class="list-group-item empty-placeholder">
        {{ emptyPlaceholder }}
      </li>
    </template>

  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import PlayerGoalsRow from "./PlayerGoalsRow.vue";
import GoalsStore from "./js/playerGoalsStore.js";

export default {
  components: {
    PlayerGoalsRow,
    draggable,
  },
  props: [
    'label',
    'listKey',
    'goals',
    'splitList',
  ],
  data() {
    return {
      drag: false,
    }
  },
  computed: {
    emptyPlaceholder() {
      return this.listKey === 'short'
          ? this.$t('app.widgets.player_goals.default_short_goal')
          : this.$t('app.widgets.player_goals.default_long_goal');
    },
    dragOptions() {
      return {
        animation: 500,
        group: "goals-list",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    onStart(evt) {
      this.drag = true
    },

    onEnd(evt) {
      this.drag = false
      GoalsStore.commit('save');
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./scss/widget.scss";
</style>