<template>
  <perfect-scrollbar class="transaction-log-settings-scroll">
    <div class="me-3">
      <form>
        <div v-if="!settings.rules.length">
          {{ $t('app.widgets.transaction_log.press_add_new') }}
        </div>
        <div class="row g-3 align-items-start mb-sm-5 mb-lg-3" v-for="(element, listIndex) in settings.rules" :key="listIndex">
          <div class="col-2 col-lg-1" style="flex-basis: 70px;">
            <Toggle
                v-model="element.enabled"
                :onLabel="$t('app.common.on')"
                :offLabel="$t('app.common.off')"/>
          </div>

          <div class="col-lg-10">
            <div class="row">
              <!-- First row-->
              <div class="d-none d-xl-block col-1 pt-1 text-end">
                {{ $t('app.widgets.transaction_log.when') }}
              </div>
              <div class="col-12 col-xl-7" :class="{'disabled': !element.enabled}">
                <input
                    class="form-control"
                    type="text"
                    v-model="element.phrase"
                    :placeholder="$t('app.widgets.transaction_log.enter_phrase')">
              </div>
              <div class="col-6 col-xl-2" :class="{'disabled': !element.enabled}">
                <input
                    class="form-control"
                    type="text"
                    v-model="element.lessThan"
                    v-on:keydown="element.moreThan = null"
                    :placeholder="$t('app.widgets.transaction_log.is_less_than')">
              </div>
              <div class="col-6 col-xl-2" :class="{'disabled': !element.enabled}">
                <input
                    class="form-control"
                    type="text"
                    v-model="element.moreThan"
                    v-on:keydown="element.lessThan = null"
                    :placeholder="$t('app.widgets.transaction_log.is_more_than')">
              </div>
            </div>
            <div class="row">
              <!-- Second row-->
              <div class="d-none d-xl-block col-1 pt-1 text-end">
                {{ $t('app.widgets.transaction_log.then') }}
              </div>
              <div class="col-6 col-lg-3" :class="{'disabled': !element.enabled}">
                <select class="form-select" v-model="element.type">
                  <option value="" disabled selected>{{ $t('app.widgets.transaction_log.type_placeholder') }}</option>
                  <option value="excluded">{{ $t('app.widgets.transaction_log.make_excluded') }}</option>
                  <option value="featured">{{ $t('app.widgets.transaction_log.make_featured') }}</option>
                </select>
              </div>
              <div class="col-6 col-lg-3" :class="{'disabled': !element.enabled}">
                <ColorPalette
                    v-if="element.type==='featured'"
                    parent-name="transaction-log"
                    :listIndex="listIndex"
                    :current="element.params.color"
                    @colorChange="colorChange"/>
              </div>
              <div class="col-12 col-lg-4" :class="{'disabled': !element.enabled}">
                <div class="form-check m-0" title="filter by title only">
                  <input class="form-check-input"
                         type="checkbox"
                         v-model="element.params.titleonly"
                         :id="`titleonly_${listIndex}`"
                         :value="true"
                         :checked="element.params.titleonly"
                  >
                  <label class="form-check-label text-xs" :for="`titleonly_${listIndex}`">{{ $t('app.widgets.transaction_log.title_only') }}</label>
                </div>
                <div class="form-check m-0" v-if="element.type==='featured'" title="make the title blink">
                  <input class="form-check-input"
                         type="checkbox"
                         v-model="element.params.blink"
                         :id="`blink_${listIndex}`"
                         :value="true"
                         :checked="element.params.blink">
                  <label class="form-check-label text-xs" :for="`blink_${listIndex}`">{{ $t('app.widgets.transaction_log.make_blink') }}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-xl-1 d-flex justify-content-end trash" @click="remove(listIndex)">
            <button class="btn btn-outline-secondary rounded-0 px-3" type="button" :title="$t('app.widgets.transaction_log.remove_row')">
              <font-awesome-icon :icon="'trash-alt'"/>
            </button>
          </div>
        </div>
      </form>
    </div>
  </perfect-scrollbar>

  <div class="pt-4 text-end">
    <button class="btn btn-primary" type="submit" @click="add">{{ $t('app.common.add_new') }}</button>
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
        localStorage.setItem("transactionLogSettings", JSON.stringify(newList));
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
              'titleonly': false,
              'lessThan': 'null',
              'moreThan': null,
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
