<template>
  <widget>
    <template #header>
      <div class="d-flex justify-content-between">
        <h4 class="card-title pb-0 mb-0">{{ $t('app.widgets.inventory.title') }}</h4>
      </div>
    </template>

    <div class="p-2">
      <div v-if="!gameData" class="text-muted small">{{ $t('app.widgets.inventory.no_data') }}</div>

      <div v-else>
        <div v-if="items && items.length">
          <div class="d-flex mb-2 gap-2 align-items-center">
            <input v-model="filters.q" class="form-control form-control-sm" :placeholder="$t('app.widgets.inventory.filter_placeholder')" />
            <select v-model="sort.by" class="form-select form-select-sm" style="width:120px">
              <option value="name">{{ $t('app.widgets.inventory.sort_name') }}</option>
              <option value="amount">{{ $t('app.widgets.inventory.sort_amount') }}</option>
            </select>
            <button class="btn btn-sm btn-outline-secondary" @click="toggleSortDir()">{{ sort.dir === 'asc' ? '↑' : '↓' }}</button>
          </div>

          <perfect-scrollbar :class="'resizable-element'" data-min-resizable-height="90">
            <div class="list-group list-group-flush">
              <div
                v-for="it in displayedItems"
                :key="it.name"
                class="list-group-item border-start-0 border-end-0 border-top-0 d-flex justify-content-between align-items-center px-0 py-2"
              >
                <div class="me-auto">
                  <div class="text-sm">{{ it.name || $t('app.widgets.inventory.unknown') }}</div>
                  <div v-if="it.price !== undefined && it.price !== null" class="text-muted price-text">
                    <font-awesome-icon :icon="'coins'" class="fa-icon"/>
                    {{ formatPrice(it.price) }} {{ $t('app.common.credits') }}
                  </div>
                </div>
                <span class="text-muted">{{ displayAmount(it).toLocaleString() }}</span>
              </div>
            </div>
          </perfect-scrollbar>
        </div>

        <pre v-else class="small mt-2" style="white-space: pre-wrap; word-break: break-word;">{{ formatted }}</pre>
      </div>
    </div>
  </widget>
</template>

<script>
import Widget from "../Widget.vue";

export default {
  name: 'InventoryWidget',
  components: { Widget },
  props: {
    gameData: [Object, Array, String],
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
      if (!this.gameData) return [];

      // If gameData is an object that contains `.inventory` (our normalized format)
      if (typeof this.gameData === 'object' && !Array.isArray(this.gameData) && this.gameData.inventory) {
        const inv = this.gameData.inventory;
        if (Array.isArray(inv)) {
          return inv.map((it) => ({
            amount: Number(it.amount ?? it.quantity) || 0,
            name: it.name || null,
            price: it.price ?? null,
          }));
        }
        if (typeof inv === 'object') {
          return Object.entries(inv).map(([k, v]) => {
            if (v && typeof v === 'object') {
              return {
                amount: Number(v.amount ?? v.quantity) || 0,
                name: v.name || null,
                price: v.price ?? null,
              };
            }
            return { amount: Number(v) || 0, name: null, price: null };
          });
        }
      }

      // If gameData itself is an array of items
      if (Array.isArray(this.gameData)) {
        return this.gameData.map((it) => ({
          amount: Number(it.amount ?? it.quantity) || 0,
          name: it.name || null,
          price: it.price ?? null,
        }));
      }

      return [];
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
</style>
