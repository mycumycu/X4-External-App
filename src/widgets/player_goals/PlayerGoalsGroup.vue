<template>
  <h6 :class="goals[listKey].length === 0?'empty':null">{{ label }}</h6>
  <draggable
      item-key="id"
      class="list-group"
      tag="transition-group"
      :component-data="{
          tag: 'ul',
          name: !drag ? 'flip-lists' : null
      }"
      v-model="goals[listKey]"
      v-bind="dragOptions"
      @start="onStart"
      @end="onEnd">
    <template #item="{ element }">
      <player-goals-row
          :listKey="listKey"
          :element="element"
      />
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
  ],
  data() {
    return {
      drag: false,
    }
  },
  computed: {
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

<style lang="scss">
h6 {
  &.empty {
    opacity: 0.5;
  }
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

</style>