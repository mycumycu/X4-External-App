<template>
  <widget>
    <template #header>
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
        <input class="form-control" ref="search" :class="{'edit-mode': this.editIndex !== null}" type="text" placeholder="Add new goal..." v-model="taskName" @keypress.enter="store"/>
        <button class="btn btn-outline-secondary rounded-0 search-btn" type="button" @click="store">
          <font-awesome-icon :icon="this.editIndex!== null ? `check`:`plus`"/>
        </button>
      </div>
    </template>

    <perfect-scrollbar :class="'resizable-element'" data-min-resizable-height="50">
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
  </widget>
</template>


<script>
import draggable from 'vuedraggable'
import Widget from "../Widget.vue";
import Modal from "../../components/Modal.vue";
import PlayerGoalsGroup from "./PlayerGoalsGroup.vue";
import PlayerGoalsSettings from "./PlayerGoalsSettings.vue";
import {faCheck, faEllipsisH, faPlus} from '@fortawesome/free-solid-svg-icons'
import {library} from "@fortawesome/fontawesome-svg-core";
import GoalsStore from "./js/playerGoalsStore.js";
import {reactive} from "vue";
import Helper from "./js/helper";

library.add(faPlus, faEllipsisH, faCheck);

const LIST_SHORT = 'short';

export default {
  components: {
    Modal,
    PlayerGoalsSettings,
    PlayerGoalsGroup,
    draggable,
    Widget,
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
      taskName: '',
      list: LIST_SHORT,
      editIndex: null,
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
    store() {
      if (this.taskName !== '') {
        if (this.editIndex === null) {
          this.goals[this.list].push(
              {
                id: Math.random().toString(36).slice(2),
                task: this.taskName,
                checked: false,
                featuredIndex: 0,
              }
          );
        } else {
          this.goals[this.list][this.editIndex].task = this.taskName;
        }
        this.taskName = '';
        this.editIndex = null;
        this.list = LIST_SHORT;

        // default add to short term tasks
        GoalsStore.commit('save');
      }
    },
    edit(object) {
      this.list = object.listKey;
      this.editIndex = Helper.getGoalIndex(this.goals[object.listKey], object.element.id);
      this.taskName = object.element.task;
      this.$refs["search"].focus(); // set focus to search input
    },
  },
  mounted() {
    this.emitter.on('editTask', object => this.edit(object));
  }
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

input {
  &.edit-mode {
    border-color: #DB6574;
  }
}
</style>