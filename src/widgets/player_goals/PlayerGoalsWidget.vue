<template>
  <div class="card mt-4">
    <div class="card-header">
      <div class="d-flex justify-content-between">
        <div><h4 class="card-title pb-3">Goals</h4></div>
        <div>
          <font-awesome-icon class="cursor-pointer" :icon="`cogs`" data-bs-toggle="modal" data-bs-target="#player-goals-setings"/>
          <Modal id="player-goals-setings" title="Player goals settings" size="modal-md">
            <PlayerGoalsSettings :settings="settings"/>
          </Modal>
        </div>
      </div>

      <div class="input-group mb-4">
        <input class="form-control" type="text" placeholder="Add new goal..." v-model="newTask" @keypress.enter="addNew"/>
        <button class="btn btn-outline-secondary rounded-0 search-btn" type="button" @click="addNew">
          <font-awesome-icon :icon="`plus`"/>
        </button>
      </div>

      <perfect-scrollbar :class="'ps-active-mission resizable-element'" data-min-resizable-height="50">
        <player-goals-group
            :label="settings.enableLongTerm?`Short term`:``"
            :goals="goals"
            list-key="short"/>
        <div class="mt-4" v-if="settings.enableLongTerm">
          <player-goals-group
              label="Long term"
              :goals="goals"
              list-key="long"/>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>


<script>
import draggable from 'vuedraggable'
import Modal from "../../components/Modal.vue";
import PlayerGoalsGroup from "./PlayerGoalsGroup.vue";
import PlayerGoalsSettings from "./PlayerGoalsSettings.vue";
import {faEllipsisH, faPlus} from '@fortawesome/free-solid-svg-icons'
import {library} from "@fortawesome/fontawesome-svg-core";
import GoalsStore from "./js/playerGoalsStore.js";
import {reactive} from "vue";

library.add(faPlus, faEllipsisH);

export default {
  components: {
    Modal,
    PlayerGoalsSettings,
    PlayerGoalsGroup,
    draggable,
  },
  props: {
    maxHeight: {
      type: Number,
      default: 40
    },
  },
  computed: {},
  data() {
    return {
      newTask: '',
      goals: GoalsStore.state.goals,
      settings: reactive(
          JSON.parse(localStorage.getItem("playerGoalsSettings")) ||
          {
            enableLongTerm: true
          }
      ),
    }
  },
  /**
   */
  watch: {
    goals: {
      handler(newValue, oldValue) {
        GoalsStore.commit('save')
      },
      deep: true,
    },
  },
  methods: {
    addNew() {
      if (this.newTask !== '') {
        this.goals.short.push(
            {
              id: Math.random().toString(36).slice(2),
              task: this.newTask,
              checked: false,
              featuredIndex: 0,
            }
        );
        this.newTask = '';

        // default add to short term tasks
        GoalsStore.commit('save');
      }
    },
  },
}
</script>

<style lang="scss" scoped>
h6 {
  font-size: 0.85rem
}

label {
  display: block;
  padding-left: 20px;
}

input[type='checkbox'] {
  margin-right: 6px;
  margin-left: -20px;
}
</style>