<template>
  <transition name="fade" mode="out-in">
    <div class="d-flex justify-content-between w-100"

         :class="{
            'hovered':hovered,
            'fadeout':this.element.checked
         }"
         @mouseover="hovered = true"
         @mouseleave="hovered = false"
    >
      <div class="d-flex text-sm goal-row" :class="{ 'finished':this.element.checked }">
        <label>
          <input type="checkbox"
                 class="form-check-input"
                 v-model="this.element.checked"
                 :value="true"/>
        </label>
        <span class="goal-data">
        <font-awesome-icon
            @click.prevent="makeFeatured"
            class="featured"
            :icon="this.featuredElement"
            v-if="this.element.featuredIndex"/>
        {{ element.task }}
          </span>
      </div>
      <div v-if="hovered" class="me-3 text-sm">
        <font-awesome-icon :icon="`ellipsis-h`" class="menu" data-bs-toggle="dropdown"/>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="navbarDropdownMenuLink1">
          <li @click="toggleFeatured" v-text="this.element.featuredIndex === 0 ? $t('app.widgets.player_goals.make_featured') : $t('app.widgets.player_goals.disable_featured')"></li>
          <li @click="edit">{{ $t('app.widgets.player_goals.edit_goal') }}</li>
          <li @click="remove">{{ $t('app.widgets.player_goals.remove') }}</li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>

import GoalsStore from "./js/playerGoalsStore.js";
import { faExclamation, faQuestion, faSearch, faShieldAlt, faStar } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faExclamation, faQuestion, faShieldAlt, faSearch, faStar);

export default {
  props: [
    'listKey',
    'element',
  ],
  data() {
    return {
      show: true,
      hovered: false,
      removingTimeoutId: null,
      featuredArray: ['', 'exclamation', 'question', 'shield-alt', 'search', 'star'],
    }
  },
  computed: {
    featuredElement() {
      return this.featuredArray[this.element.featuredIndex];
    }
  },
  /**
   */
  watch: {
    element: {
      handler(newValue, oldValue) {
        this.cancelTaskRemoval();
        this.removeOnCheck();
        GoalsStore.commit('save')
      },
      deep: true,
    },
  },
  methods: {
    /**
     */
    toggleFeatured() {
      this.element.featuredIndex = this.element.featuredIndex === 0 ? 1 : 0;
    },
    /**
     */
    makeFeatured() {
      this.element.featuredIndex++;
      if (this.element.featuredIndex >= this.featuredArray.length) {
        this.element.featuredIndex = 1;
      }
    },
    removeOnCheck() {
      if (this.element.checked) {
        const id = this.element.id;
        const key = this.listKey;
        GoalsStore.commit('moveToBottom', { key, id })
        this.removingTimeoutId = setTimeout(() => {
          GoalsStore.commit('remove', { key, id })
        }, 3000);
      }
    },
    /**
     */
    cancelTaskRemoval() {
      clearTimeout(this.removingTimeoutId);
    },
    /**
     */
    edit() {
      const id = this.element.id;
      const key = this.listKey;
      this.emitter.emit('editTask', {
        element: this.element,
        listKey: this.listKey,
      });
    },
    /**
     */
    remove() {
      const id = this.element.id;
      const key = this.listKey;
      GoalsStore.commit('remove', { key, id })
    },
  },
  mounted() {
    this.removeOnCheck();
  }
}
</script>

<style lang="scss" scoped>
label {
  display: block;
  padding-left: 20px;
}

input[type='checkbox'] {
  margin-right: 6px;
  margin-left: -20px;
}

.menu {
  cursor: pointer;
}

.hovered {
  color: #ccc;
}

.fadeout {
  -webkit-animation: 3s ease 0s normal forwards 1 fadeout;
  animation: 3s ease 0s normal forwards 1 fadeout;
}

@keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-webkit-keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.featured {
  color: #DB6574;
  width: 24px;
}

.goal-row {
  width: 85%;

  .goal-data {
    cursor: default;
  }
}

.dropdown-menu {
  min-width: 30px;

  li {
    padding: 4px 10px;
    font-size: 0.8rem;
    cursor: default;

    &:hover {
      background: #444;
      color: #aaa;
    }

    &:last-child {
      border-top: #666 1px solid;
    }
  }
}

</style>
