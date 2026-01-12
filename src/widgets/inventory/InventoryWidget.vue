<template>
  <widget>
    <template #header>
      <div class="d-flex justify-content-between">
        <h4 class="card-title pb-0 mb-0">{{ $t('app.widgets.inventory.title') }}</h4>
        <div>
          <font-awesome-icon
            class="cursor-pointer"
            :icon="'cogs'"
            data-bs-toggle="modal"
            data-bs-target="#inventory-settings"
          />
          <Modal id="inventory-settings" :title="$t('app.widgets.inventory.settings.title')">
            <InventorySettings :settings="settings" />
          </Modal>
        </div>
      </div>
    </template>

    <div class="overflow-hidden ps-2 mb-2" style="height: 50px">
      <div v-if="items && items.length" class="d-flex gap-2 align-items-center pt-2">
        <input v-model="filters.q" class="form-control form-control-sm" :placeholder="$t('app.widgets.inventory.filter_placeholder')" />
        <select v-model="sort.by" class="form-select form-select-sm sort-select">
          <option value="name">{{ $t('app.widgets.inventory.sort_name') }}</option>
          <option value="amount">{{ $t('app.widgets.inventory.sort_amount') }}</option>
          <option value="value">{{ settings.displayMode === 'value' ? $t('app.widgets.inventory.sort_value') : $t('app.widgets.inventory.sort_price') }}</option>
        </select>
        <button class="btn btn-sm btn-outline-secondary rounded-0" @click="toggleSortDir()">{{ sort.dir === 'asc' ? '↑' : '↓' }}</button>
      </div>
      <div v-else class="text-muted small pt-2">{{ $t('app.widgets.inventory.no_data') }}</div>
    </div>

    <perfect-scrollbar class="inventory-widget resizable-element" data-min-resizable-height="90">
      <!-- Grouped view when categories enabled -->
      <div v-if="settings.showCategories && groupedItems && groupedItems.length" class="accordion inventory-list">
        <div v-for="group in groupedItems" :key="group.id" class="accordion-item border-top-0 border-start-0 border-end-0">
          <h2 class="accordion-header">
            <button
              class="accordion-button align-items-start"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#inv-cat-${group.id}`"
            >
              <span class="group-name">[{{ group.items.length }}] {{ group.name }}</span>
            </button>
          </h2>
          <div :id="`inv-cat-${group.id}`" class="accordion-collapse collapse show">
            <div class="accordion-body px-2 py-1">
              <div class="list-group list-group-flush">
                <div
                  v-for="it in group.items"
                  :key="it.name"
                  class="list-group-item border-start-0 border-end-0 border-top-0 d-flex justify-content-between align-items-center px-0 py-2"
                >
                  <div class="me-auto">
                    <div class="text-sm" :class="{ 'illegal-ware': it.illegal }" :title="it.illegal ? $t('app.widgets.inventory.illegal_tooltip') : null">
                      <span v-if="it.illegal" class="illegal-indicator">!</span>{{ it.name || $t('app.widgets.inventory.unknown') }}
                    </div>
                    <div v-if="it.price != null" class="price-text text-muted">
                      <font-awesome-icon :icon="'coins'" class="fa-icon"/>
                      {{ formatPrice(settings.displayMode === 'value' ? it.price * it.amount : it.price) }} {{ $t('app.common.credits') }}
                    </div>
                  </div>
                  <span :class="it.illegal ? 'illegal-ware' : 'text-muted'">{{ it.amount.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Flat view (default) -->
      <div v-else-if="items && items.length" class="list-group list-group-flush ps-2 inventory-list">
        <div
          v-for="it in displayedItems"
          :key="it.name"
          class="list-group-item border-start-0 border-end-0 border-top-0 d-flex justify-content-between align-items-center px-0 py-2"
        >
          <div class="me-auto">
            <div class="text-sm" :class="{ 'illegal-ware': it.illegal }" :title="it.illegal ? $t('app.widgets.inventory.illegal_tooltip') : null">
              <span v-if="it.illegal" class="illegal-indicator">!</span>{{ it.name || $t('app.widgets.inventory.unknown') }}
            </div>
            <div v-if="it.price != null" class="price-text text-muted">
              <font-awesome-icon :icon="'coins'" class="fa-icon"/>
              {{ formatPrice(settings.displayMode === 'value' ? it.price * it.amount : it.price) }} {{ $t('app.common.credits') }}
            </div>
          </div>
          <span :class="it.illegal ? 'illegal-ware' : 'text-muted'">{{ it.amount.toLocaleString() }}</span>
        </div>
      </div>

      <pre v-else class="small mt-2 px-2" style="white-space: pre-wrap; word-break: break-word;">{{ formatted }}</pre>
    </perfect-scrollbar>
  </widget>
</template>

<script>
import Widget from "../Widget.vue";
import Modal from "../../components/Modal.vue";
import InventorySettings from "./InventorySettings.vue";

export default {
  name: 'InventoryWidget',
  components: { Widget, Modal, InventorySettings },
  props: {
    gameData: Object,
    maxHeight: {
      type: Number,
      default: 40,
    },
  },
  data() {
    return {
      filters: {
        q: '',
      },
      sort: {
        by: 'name',
        dir: 'asc',
      },
      settings: {
        showCategories: false,
        categories: [],
        displayMode: 'price',
        ...JSON.parse(localStorage.getItem('inventorySettings') || '{}'),
      },
    };
  },
  watch: {
    gameData: {
      handler(newData) {
        if (newData && typeof newData === 'object') {
          Object.values(newData).forEach(item => {
            if (item.category?.id && !this.settings.categories.find(c => c.id === item.category.id)) {
              this.settings.categories.push({ ...item.category, enabled: true });
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    toggleSortDir() {
      this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
    },
    formatPrice(price) {
      const n = Number(price) || 0;
      return n.toLocaleString('fr-FR').replace(/,/g, '.');
    }
  },
  computed: {
    formatted() {
      try {
        if (typeof this.gameData === 'string') return this.gameData;
        return JSON.stringify(this.gameData, null, 2);
      } catch (e) {
        return String(this.gameData);
      }
    },
    items() {
      if (!this.gameData || typeof this.gameData !== 'object') return [];

      return Object.values(this.gameData).map((item) => ({
        name: item.name,
        amount: Number(item.amount) || 0,
        price: item.price ?? null,
        illegal: !!item.illegal,
        category: item.category || { id: '', name: '' },
      }));
    },
    groupedItems() {
      if (!this.settings.showCategories) {
        return null;
      }

      const groups = {};
      const enabledCatIds = this.settings.categories
        .filter(c => c.enabled)
        .map(c => c.id);

      this.displayedItems.forEach(item => {
        const catId = item.category?.id;
        if (catId && enabledCatIds.includes(catId)) {
          if (!groups[catId]) {
            groups[catId] = {
              id: catId,
              name: item.category?.name || '',
              items: []
            };
          }
          groups[catId].items.push(item);
        }
      });

      return Object.values(groups)
        .filter(g => g.items.length > 0)
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    },
    displayedItems() {
      let list = (this.items || []).slice();

      // Filter by search text
      const q = (this.filters.q || '').toLowerCase().trim();
      if (q) {
        list = list.filter((it) => (it.name || '').toLowerCase().includes(q));
      }

      // Sorting
      const by = this.sort.by || 'name';
      const dir = this.sort.dir === 'desc' ? -1 : 1;

      list.sort((a, b) => {
        if (by === 'amount') {
          return (a.amount - b.amount) * dir;
        }
        if (by === 'value') {
          const va = this.settings.displayMode === 'value'
            ? (a.price || 0) * a.amount
            : (a.price || 0);
          const vb = this.settings.displayMode === 'value'
            ? (b.price || 0) * b.amount
            : (b.price || 0);
          return (va - vb) * dir;
        }
        // default: sort by name
        const sa = (a.name || '').toLowerCase();
        const sb = (b.name || '').toLowerCase();
        return sa.localeCompare(sb) * dir;
      });

      return list;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./scss/widget.scss";

pre {
  background: transparent;
  border: none;
  margin: 0;
}

.price-text {
  font-size: 0.65rem;
}

.sort-select {
  width: 180px;
}

.illegal-ware {
  color: #d4a846;
}

.illegal-indicator {
  font-weight: bold;
  margin-right: 0.25rem;
}

.inventory-list {
  padding-right: 0.1rem;
}

:deep(.accordion) {
  .accordion-button {
    padding: 0.4rem 0.4rem 0.4rem 0;

    &:not(.collapsed) {
      background: none;
      box-shadow: none;
    }

    &:focus {
      box-shadow: none;
    }
  }

  .group-name {
    color: var(--bs-primary);
  }
}

:deep(.inventory-widget) {
  overflow: hidden;
  position: relative;
  z-index: 1;

  .ps__rail-y {
    z-index: 10;
    pointer-events: auto !important;
  }
}
</style>
