<template>
  <widget>
    <template #header>
      <div class="d-flex justify-content-between">
        <div><h4 class="card-title pb-3">{{ $t('app.widgets.player_goals.title') }}</h4></div>
        <div>
          <font-awesome-icon class="cursor-pointer" :icon="`cogs`" data-bs-toggle="modal" data-bs-target="#player-goals-setings"/>
          <Modal id="player-goals-setings" :title="$t('app.widgets.player_goals.settings_title')" size="modal-md">
            <PlayerGoalsSettings :settings="settings"/>
          </Modal>
        </div>
      </div>

      <div class="input-group mb-4">
        <input class="form-control" ref="task" :class="{'focus-mode': hasFocus, 'task': hasSpeechRecognition}" type="text" :placeholder="$t('app.widgets.player_goals.add_new_goal')" v-model="taskName" @keypress.enter="store" @focus="focusIn" @blur="focusOut"/>
        <button v-if="hasSpeechRecognition" class="btn rounded-0 mic-btn" :class="{'focus-mode': hasFocus}" type="button" @click="speachToText">
          <font-awesome-icon :icon="'microphone'" :class="{'fa-icon': true, 'recognizing': isRecognizing}"/>
        </button>
        <button class="btn btn-outline-secondary rounded-0" :class="{'border-start-0' : hasSpeechRecognition}" type="button" @click="store">
          <font-awesome-icon :icon="this.editIndex!== null ? `check`:`plus`"/>
        </button>
      </div>
    </template>

    <perfect-scrollbar :class="'resizable-element'" data-min-resizable-height="50">
      <player-goals-group
          :label="settings.enableLongTerm?$t('app.widgets.player_goals.short_term'):''"
          :goals="goals"
          list-key="short"/>
      <div class="mt-4" v-if="settings.enableLongTerm">
        <player-goals-group
            :label="$t('app.widgets.player_goals.long_term')"
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
import { faCheck, faEllipsisH, faPlus } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import GoalsStore from "./js/playerGoalsStore.js";
import { reactive } from "vue";
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
  computed: {
    hasSpeechRecognition () {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition);
    },
    isRecognizing () {
      return this.recognition !== null;
    },
  },
  data () {
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
      hasFocus: false,
      recognition: null,
    }
  },
  /**
   */
  watch: {
    goals: {
      handler (newValue, oldValue) {
        GoalsStore.commit('save')
      },
      deep: true,
    },
  },
  methods: {
    store () {
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
    edit (object) {
      this.list = object.listKey;
      this.editIndex = Helper.getGoalIndex(this.goals[object.listKey], object.element.id);
      this.taskName = object.element.task;
      this.focusIn()
    },
    speachToText () {
      if (this.recognition) {
        this.recognition.abort();
        this.recognition = null;
        return;
      }

      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.focusIn()
      };
      this.recognition.onend = () => {
        this.recognition = null;
      };
      this.recognition.onresult = (event) => {
        this.taskName = event.results[0][0].transcript;
      };

      this.recognition.start();
    },
    focusIn () {
      this.$refs["task"].focus(); // set focus to task input
      this.hasFocus = true;
    },
    focusOut () {
      this.hasFocus = false;
    },
  },
  mounted () {
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

.focus-mode {
  border-color: #DB6574 !important;
}

.mic-btn {
  border: 1px solid #40444b;
  border-left: none;
  border-right: 1px solid #8a8d93;

  .recognizing {
    color: #DB6574;
  }
}

.task {
  border-right: none;
}

</style>
