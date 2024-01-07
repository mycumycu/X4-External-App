<template>
  <perfect-scrollbar class="logbook-settings-scroll">
    <div class="me-3">
      <form>
        <div v-if="!settings.rules.length">
          Press "add new" button to add some rules.
        </div>
        <div class="row g-3 align-items-center mb-sm-5 mb-lg-0" v-for="(element, listIndex) in settings.rules" :key="listIndex">
          <div class="col-sm-2 col-lg-1 flex-grow-0">
            <Toggle
                v-model="element.enabled"
                onLabel="on"
                offLabel="off"/>
          </div>
          <div class="col-7 col-lg-3" :class="{'disabled': !element.enabled}">
            <input
                class="form-control"
                type="text"
                v-model="element.phrase"
                placeholder="enter phrase">
          </div>
          <div class="col-sm-3 col-lg-2" :class="{'disabled': !element.enabled}">
            <select class="form-select" v-model="element.type">
              <option value="" disabled selected>Type...</option>
              <option value="excluded">Excluded</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          <div class="col-sm-9 col-lg-3" :class="{'disabled': !element.enabled}">
            <ColorPalette
                v-if="element.type==='featured'"
                parent-name="logbook"
                :listIndex="listIndex"
                :current="element.params.color"
                @colorChange="colorChange"/>
          </div>
          <div class="col-sm-3 col-lg-2" :class="{'disabled': !element.enabled}">
            <div class="form-check m-0" v-if="element.type==='featured'" title="make the title blink">
              <input class="form-check-input"
                     type="checkbox"
                     v-model="element.params.blink"
                     :id="`blink_${listIndex}`"
                     :value="true"
                     :checked="element.params.blink">
              <label class="form-check-label text-xs" :for="`blink_${listIndex}`">title blink</label>
            </div>
            <div class="form-check m-0" title="filter by title only">
              <input class="form-check-input"
                     type="checkbox"
                     v-model="element.params.titleonly"
                     :id="`titleonly_${listIndex}`"
                     :value="true"
                     :checked="element.params.titleonly"
              >
              <label class="form-check-label text-xs" :for="`titleonly_${listIndex}`">in title only</label>
            </div>
          </div>
          <div class="col-lg-1 d-flex justify-content-end trash" @click="remove(listIndex)">
            <button class="btn btn-outline-secondary rounded-0" type="button" title="remove row">
              <font-awesome-icon :icon="'trash-alt'"/>
            </button>
          </div>
        </div>
      </form>
    </div>
  </perfect-scrollbar>

  <div class="pt-4 text-end">
    <button class="btn btn-primary" type="submit" @click="add">Add new</button>
  </div>
</template>

<script>
import Toggle from '@vueform/toggle'
import ColorPalette from "../../components/ColorPalette.vue";

export default {
  components: {
    ColorPalette,
    Toggle,
  },
  props: ['settings'],
  data() {
    return {
      value: false,
    }
  },
  /**
   */
  watch: {
    settings: {
      handler(newList, oldList) {
        localStorage.setItem("logbookSettings", JSON.stringify(newList));
      },
      deep: true
    },
  },
  /**
   */
  methods: {
    /**
     */
    add() {

      this.settings.rules.push(
          {
            'enabled': true,
            'phrase': '',
            'type': 'featured',
            'params': {
              'color': 'color-1',
              'blink': false,
              'titleonly': true,
            },
          }
      );
    },

    /**
     * @param index
     */
    remove(index) {
      this.settings.rules.splice(index, 1);
    },
    /**
     *
     * @param data
     */
    colorChange(data) {
      const index = data.index;
      const color = data.color;
      this.settings.rules[index]['params']['color'] = color;
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "./scss/settings.scss";
</style>