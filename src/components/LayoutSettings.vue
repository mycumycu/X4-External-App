<template>
  <div class="row">
    <div class="col-sm-2 p-1 caption">No. of columns</div>
    <div class="col-sm-10">
      <select class="form-select" v-model="columnsNo">
        <option :value="index" v-for="index in 4" :key="index">{{ index }} column(s)</option>
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-2"></div>
    <div class="col-sm-10 pt-2">
      <label><input type="checkbox"
                    class="form-check-input"
                    v-model="this.layout.limitHeight"
                    :value="true"/>
        limit widgets height to available viewport height (hides scrollbar)</label>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-2"></div>
    <div class="col-sm-10 pt-2">
      <label><input type="checkbox"
                    class="form-check-input"
                    v-model="this.layout.showBreadcrumb"
                    :value="true"/>
        show breadcrumb</label>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-2"></div>
    <div class="col-sm-10 pt-2">
      <label><input type="checkbox"
                    class="form-check-input"
                    v-model="this.layout.compact"
                    :value="false"/>
        compact mode (reduces whitespace and rearranges elements for higher
        information density)</label>
    </div>
  </div>

  <div class="row mt-3">
    <div class="col-sm-2 p-1 caption">Available widgets<br/><small>drag to the desired column</small></div>
    <div class="col-sm-10">
      <div class="row">
        <div class="col-12">
          <draggable
              class="widget-area p-2"
              :list="availableWidgets"
              chosen-class="ghost"
              group="widgets"
              itemKey="name"
              :move="onMove"
              @add="onAdd">
            <template #item="{ element, index }">
              <div class="widget-element p-3">{{ this.widgetConfig[element.component].widgetName }}</div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-2 p-1 pt-2 caption">Columns<br/><small>set width of each column <span v-if="this.layout.limitHeight">and max height of each widget</span></small></div>
    <div class="col-sm-10 d-flex">
      <div :class="`col-${(12 / columnsNo)}`"
           class="drop-area column p-2"
           v-for="(column, columnNo) in columnsNo" :key="columnNo">
        <h6 class="d-flex justify-content-between">Column {{ (columnNo + 1) }}
          <select class="select-column-width"
                  v-model="layout.columns[columnNo].width"
                  :data-column-no="columnNo"
                  @change="onColumnWidthChange"
                  title="set column width">
            <option v-for="columnWidth in columnWidthOptions()" :value="columnWidth">{{ parseInt(100 / (12 / columnWidth)) }}%</option>
          </select>
        </h6>
        <draggable
            class="column-widgets"
            group="widgets"
            filter="select,.close"
            :preventOnFilter="false"
            :list="layout.columns[columnNo].widgets"
            itemKey="no"
            :data-column-no="columnNo"
            :move="onMove"
            @add="onAdd">
          <template #item="{ element, index }">
            <div class="widget-element pb-3">
              <div class="name d-flex p-2 pe-0 justify-content-between">
                {{ this.widgetConfig[element.component].widgetName }}
                <span class="close"
                      @click="remove(columnNo, index, element)"
                      title="remove widget from the column">
                  <font-awesome-icon :icon="'times'" :class="`fa-icon`"/>
                </span>
              </div>
              <div class="max-height d-flex justify-content-between px-2" v-if="this.layout.limitHeight">
                <div class="d-none d-lg-block">Max height:</div>
                <select class="select-widget-height d-block"
                        v-model="layout.columns[columnNo].widgets[index].maxHeight"
                        :data-column-no="columnNo"
                        :data-widget-no="index"
                        @change="onWidgetHeightChange"
                        title="set max widget height within the viewport">
                  <option v-for="widgetWidth in widgetHeightOptions(columnNo)" :value="parseInt(widgetWidth)">{{ widgetWidth }}%</option>
                </select>
              </div>
            </div>
          </template>
        </draggable>
      </div>

    </div>
  </div>

</template>

<script>
import draggable from 'vuedraggable'
import GlobalStore from "../globalStore";
import WidgetHeightWorker from "../widgetHeightWorker";

export default {
  components: {
    draggable,
  },
  props: ['settings'],
  data() {
    return {
      maxWidgetsInColumn: 4,
      columnsNo: null,
      availableWidgets: [],
      selectOptions: {
        columnWidths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
        widgetHeights: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      },
    }
  },

  /**
   *
   */
  mounted() {
    this.columnsNo = this.layout.columns.length
    this.setAvailableWidgets();
  },
  computed: {
    layout() {
      return GlobalStore.state.layout
    }
  },
  /**
   */
  watch: {
    /**
     *
     */
    columnsNo: {
      handler(newVal, oldVal) {
        this.columnsNo = parseInt(newVal);
        this.layout.columns = this.layout.columns.filter((column, index) => {
          if (index >= this.columnsNo) {
            column.widgets.forEach(widget => {
              // return widget from removed column back to the pool
              this.availableWidgets.push(widget);
            })
          }
          return index < this.columnsNo;
        });

        for (let i = 0; i < this.columnsNo; i++) {
          if (!this.layout.columns[i]) {
            // init an empty column
            this.layout.columns[i] = {
              widgets: [],
              width: 3,
            }
          }
        }
        if (oldVal) {
          this.columnWidthAdjust(0, 2);
        }
      },
    },
    /**
     *
     */
    layout: {
      handler(newVal, oldVal) {
        this.storeLayoutConfiguration();
      },
      deep: true,
    },
  },
  /**
   */
  methods: {
    /**
     * @param event
     */
    onColumnWidthChange(event) {
      let currentColumnNo = parseInt(event.target.dataset.columnNo);
      let currentColumnValue = parseInt(event.target.value);
      this.columnWidthAdjust(currentColumnNo, currentColumnValue)
    },
    /**
     * @returns {number[]}
     */
    columnWidthOptions() {
      const columnCount = this.layout.columns.length
      const maxAllowedWidth = 12 - (columnCount - 1);
      return this.selectOptions.columnWidths.filter(width => width <= maxAllowedWidth)
    },
    /**
     * Shrink the columns if width exeeds the grid size
     *
     * @param columnNo
     * @param widthValue
     */
    columnWidthAdjust(columnNo, widthValue) {
      const maxGridSize = 12;
      const columns = this.layout.columns;
      let currentSum = columns.reduce((sum, column) => Math.max(1, sum) + parseInt(column.width), 0);
      let columnsCount = columns.length;

      if (currentSum > maxGridSize) {
        columns.forEach((column, index) => {
          let isCurrentElement = index === columnNo;
          let isLastElement = (index + 1) === columnsCount;

          if (isCurrentElement) {
            columns[index].width = widthValue;
          } else {
            let maxWidth = (maxGridSize - widthValue) / (columnsCount - 1);
            columns[index].width = this.selectOptions.columnWidths.slice().reverse().find(width => width <= maxWidth);
            if (isLastElement) {
              columns[index].width = maxGridSize - columns.slice(0, -1).reduce((sum, column) => sum + column.width, 0);
            }
          }
        })
      }
    },
    /**
     * @param event
     */
    onWidgetHeightChange(event) {
      let currentColumnNo = parseInt(event.target.dataset.columnNo);
      let currentWidgetNo = parseInt(event.target.dataset.widgetNo);
      let currentColumnValue = parseInt(event.target.value);
      this.widgetHeightAdjust(currentColumnNo, currentWidgetNo, currentColumnValue)

    },
    /**
     * @param columnNo
     * @returns {number[]}
     */
    widgetHeightOptions(columnNo) {
      const widgetCount = this.layout.columns[columnNo].widgets.length
      const maxAllowedHeight = 100 - ((widgetCount - 1) * 10);
      return this.selectOptions.widgetHeights.filter(height => height <= maxAllowedHeight)
    },
    /**
     * @param columnNo
     * @param widgetNo
     * @param heightValue
     */
    widgetHeightAdjust(columnNo, widgetNo, heightValue) {
      if (columnNo) {
        let maxSum = 100;
        const widgets = this.layout.columns[columnNo].widgets;
        let currentSum = widgets.reduce((sum, widget) => Math.max(1, sum) + parseInt(widget.maxHeight || '50'), 0);
        let widgetsCount = widgets.length;

        if (currentSum > maxSum) {
          widgets.forEach((widget, index) => {
            let isCurrentElement = index === widgetNo;
            let isLastElement = (index + 1) === widgetsCount;

            if (isCurrentElement) {
              this.layout.columns[columnNo].widgets[index].maxHeight = heightValue;
            } else {
              let maxHeight = (maxSum - heightValue) / (widgetsCount - 1);
              this.layout.columns[columnNo].widgets[index].maxHeight = this.selectOptions.widgetHeights.slice().reverse().find(height => height <= maxHeight);
              if (isLastElement) {
                this.layout.columns[columnNo].widgets[index].maxHeight = maxSum - widgets.slice(0, -1).reduce((sum, widget) => sum + widget.maxHeight, 0);
              }
            }
          })
        }
      }
    },
    /**
     *
     */
    storeLayoutConfiguration() {
      if (!this.layout.limitHeight) {
        const heightWorker = new WidgetHeightWorker();
        heightWorker.clear();
      }

      GlobalStore.commit('updateLayout', this.layout)
    },
    /**
     * Block drag if widget count in coulmn exceeds max, unless it's drag si within the same column
     *
     * @param evt
     * @returns {boolean}
     */
    onMove(evt) {
      const widgetsCount = evt.to.children.length;
      return evt.to === evt.from || widgetsCount <= this.maxWidgetsInColumn;
    },
    /**
     * @param evt
     */
    onAdd(evt) {
      const columnNo = evt.to.dataset.columnNo;
      const widgetNo = evt.newIndex;
      this.widgetHeightAdjust(columnNo, widgetNo, 50);
    },
    /**
     * Remove widget from column
     *
     * @param column
     * @param index
     * @param element
     */
    remove(column, index, element) {
      element.maxHeight = 50;
      this.layout.columns[column].widgets.splice(index, 1)
      this.availableWidgets.push(element);
    },

    /**
     * Set available widgets
     */
    setAvailableWidgets() {
      let usedWidgets = [];

      // get all widgets
      let allWidgets = Object.entries(this.widgetConfig).map(entry => {
        return {
          component: entry[0],
          maxHeight: entry[1].maxHeight,
        }
      });

      // get widgets that are already in use
      this.layout.columns.forEach(column => {
        column.widgets.forEach(widget => {
          usedWidgets.push(JSON.parse(JSON.stringify(widget)));
        })
      })

      // filter only different ones
      this.availableWidgets = allWidgets.filter(value => {
        return !usedWidgets.some(object => object.component === value.component)
      });
    },

  },
}
</script>

<style src="../../node_modules/@vueform/toggle/themes/default.css"></style>
<style lang="scss">
.caption {
  line-height: 100%;

  small {
    display: inline-block;
    line-height: 100%;
    padding-top: 8px;
    color: #666;
  }
}

.widget-area {
  align-items: center;

  .widget-element {
    display: flex;
    align-items: center;
    min-height: 80px;
    width: 140px;
    text-align: center;
    line-height: 110%;
    color: #fff;
    margin-right: 0.5rem !important;
    transition: all .3s;

    &:hover {
      border: #90cb70 1px solid;
    }
  }
}

.widget-element {
  cursor: grab;
  display: block;
  transition: all .3s;

  border: #999 1px solid;
  border-radius: 4px;
  margin-bottom: 10px;

  @media (max-width: 980px) {
    .max-height {
      justify-content: center !important;
    }
  }

  &:hover {
    border: #90cb70 1px solid;
  }

  .name {
    color: #fff;
    height: 60px;
    line-height: 110%;
  }

  &.ghost {
    color: #000;
    background: #fff;
  }

  .close {
    color: #999;
    float: right;
    margin-right: 10px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #fff;
    }
  }
}

.widget-area {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height: 110px;
  border: #333 1px solid;
}

.drop-area {
  border-left: #333 1px solid;
  min-height: 250px;

  .column-widgets {
    min-height: 150px;

  }

  h6 {
    flex-direction: column;
    align-items: center;
    @media (min-width: 992px) {
      flex-direction: row;
    }
  }
}

.select-column-width,
.select-widget-height {
  width: 70px;
}

</style>