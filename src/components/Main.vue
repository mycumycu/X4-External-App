<template>
  <div class="d-flex align-items-stretch">
    <!-- Sidebar Navigation-->
    <div class="page-content form-page">
      <!-- Breadcrumb-->
      <breadcrumb v-if="!dataFetchError && this.layout.showBreadcrumb"/>

      <section :class="[ compact ? 'pt-1 pb-1' : 'pt-4 pb-1' ]">
        <div :class="{ 'container-fluid': !compact }">

          <no-connection v-show="dataFetchError"/>
          <div class="row" :class="{ 'gx-1 mx-0': compact, 'gy-4': !compact }" v-show="!dataFetchError">
            <template v-for="(column, columnIndex) in layout.columns">
              <div :class="[`app-column-${columnIndex}`, `col-${column.width}`, { 'gy-1': compact }]" class="d-flex flex-column mt-0">
                <div v-for="widget in column.widgets">
                  <component
                      ref="widgets"
                      :is="widget.component"
                      :gameData="this.gameData[widget.component]"
                      :maxHeight="widget.maxHeight"
                      :data-name="widget.component"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>

import SearchBar from "./SearchBar.vue";
import NoConnection from "./NoConnection.vue";
import Breadcrumb from "./Breadcrumb.vue";
import WidgetHeightWorker from "../widgetHeightWorker";
import GlobalStore from "../globalStore";

export default {
  components: { Breadcrumb, NoConnection, SearchBar },

  emits: [
    'updatePending'
  ],
  props: [],
  inject: ['compact'],
  data() {
    return {
      gameData: {},

      dataFetchError: false,
      widgets: [],
    }
  },
  /**
   *
   */
  computed: {
    /**
     * @returns {*}
     */
    layout() {
      return GlobalStore.state.layout
    },
  },
  /**
   */
  watch: {
    layout: {
      handler(newValue, oldValue) {
        GlobalStore.commit('updateLayout', newValue)
        this.resizeWidgets();
        this.setDocumentTouchAction(newValue.limitHeight);
      },
      deep: true,
    },
    dataFetchError: {
      handler(newValue, oldValue) {
        setTimeout(() => {
          this.resizeWidgets();
        }, 200)
      },
    },
  },
  methods: {
    /**
     * Fetch game data
     *
     */
    async getData() {
      try {
        await fetch(`/api/data`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }).then(response => response.text())
            .then((response) => {
              let gameData = JSON.parse(response);
              if (gameData) {
                this.gameData = gameData;
                this.$emit('updatePending', gameData.updatePending);

                this.dataFetchError = false;
              } else this.dataFetchError = true;
            })
      } catch (e) {
        this.dataFetchError = true;
        console.log(e)
      }
    },

    /**
     * Resize widgets to fit viewport
     */
    async resizeWidgets() {
      if (this.layout.limitHeight && this.$refs.widgets) {
        for await (const widget of this.$refs.widgets) {
          const heightWorker = new WidgetHeightWorker();
          heightWorker.run(this.$refs, widget);
        }
      }
    },

    /**
     * Set document touch action
     * @param isHeightLimited
     */
    setDocumentTouchAction(isHeightLimited){
      document.body.style.touchAction = isHeightLimited ? 'none' : null;
    }
  },

  /**
   *
   */
  mounted() {
    this.emitter.on('resizeWidgets', this.resizeWidgets)

    let dataFetchInterval = 2000;

    this.getData();
    setInterval(() => {
      this.getData();
    }, dataFetchInterval)

  },

}
</script>

<style lang="scss"></style>