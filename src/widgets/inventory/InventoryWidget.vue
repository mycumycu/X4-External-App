<template>
  <widget>
    <template #header>
      <div class="d-flex justify-content-between">
        <h4 class="card-title pb-0 mb-0">{{ $t('app.widgets.inventory.title') }}</h4>
      </div>
    </template>

    <div class="overflow-hidden px-2 mb-2" style="height: 50px">
      <div v-if="items && items.length" class="d-flex gap-2 align-items-center pt-2">
        <input v-model="filters.q" class="form-control form-control-sm" :placeholder="$t('app.widgets.inventory.filter_placeholder')" />
        <select v-model="sort.by" class="form-select form-select-sm sort-select">
          <option value="name">{{ $t('app.widgets.inventory.sort_name') }}</option>
          <option value="amount">{{ $t('app.widgets.inventory.sort_amount') }}</option>
          <option value="value">{{ $t('app.widgets.inventory.sort_value') }}</option>
        </select>
        <button class="btn btn-sm btn-outline-secondary" @click="toggleSortDir()">{{ sort.dir === 'asc' ? '↑' : '↓' }}</button>
      </div>
      <div v-else class="text-muted small pt-2">{{ $t('app.widgets.inventory.no_data') }}</div>
    </div>

    <perfect-scrollbar class="inventory-widget resizable-element" data-min-resizable-height="90">
      <div v-if="items && items.length" class="list-group list-group-flush px-2">
        <div
          v-for="it in displayedItems"
          :key="it.name"
          class="list-group-item border-start-0 border-end-0 border-top-0 d-flex justify-content-between align-items-center px-0 py-2"
        >
          <div class="me-auto">
            <div class="text-sm" :class="{ 'illegal-ware': it.illegal }" :title="it.illegal ? $t('app.widgets.inventory.illegal_tooltip') : null">
              <span v-if="it.illegal" class="illegal-indicator">!</span>{{ it.name || $t('app.widgets.inventory.unknown') }}
            </div>
            <div v-if="it.price !== undefined && it.price !== null" class="price-text text-muted">
              <font-awesome-icon :icon="'coins'" class="fa-icon"/>
              {{ formatPrice(it.price) }} {{ $t('app.common.credits') }}
            </div>
          </div>
          <span :class="it.illegal ? 'illegal-ware' : 'text-muted'">{{ displayAmount(it).toLocaleString() }}</span>
        </div>
      </div>

      <pre v-else class="small mt-2 px-2" style="white-space: pre-wrap; word-break: break-word;">{{ formatted }}</pre>
    </perfect-scrollbar>
  </widget>
</template>

<script>
import Widget from "../Widget.vue";

export default {
  name: 'InventoryWidget',
  components: { Widget },
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
    };
  },
  methods: {
    toggleSortDir() {
      this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
    },
    displayAmount(it) {
      const n = Number(it.amount) || 0;
      return n;
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
      if (!this.gameData?.inventory) return [];

      return Object.values(this.gameData.inventory).map((item) => ({
        name: item.name,
        amount: Number(item.amount) || 0,
        price: item.price ?? null,
        illegal: !!item.illegal,
      }));
    },
    displayedItems() {
      let list = (this.items || []).slice();

      // Filter by search text
      const q = (this.filters.q || '').toString().toLowerCase().trim();
      if (q) {
        list = list.filter((it) => ((it.name) || '').toString().toLowerCase().indexOf(q) !== -1);
      }

      // Sorting
      const by = this.sort.by || 'name';
      const dir = this.sort.dir === 'desc' ? -1 : 1;

      list.sort((a, b) => {
        if (by === 'amount') {
          const na = Number(a.amount || 0);
          const nb = Number(b.amount || 0);
          return (na - nb) * dir;
        }
        if (by === 'value') {
          const va = Number(a.price || 0);
          const vb = Number(b.price || 0);
          return (va - vb) * dir;
        }
        // default: sort by name
        const sa = ((a.name) || '').toString().toLowerCase();
        const sb = ((b.name) || '').toString().toLowerCase();
        if (sa < sb) return -1 * dir;
        if (sa > sb) return 1 * dir;
        return 0;
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
</style>
