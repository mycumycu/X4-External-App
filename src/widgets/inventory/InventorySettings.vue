<template>
  <div>
    <div class="d-flex gap-3 mb-3">
      <Toggle
        v-model="settings.showCategories"
        :onLabel="$t('app.common.on')"
        :offLabel="$t('app.common.off')"
      />
      <div :class="{ 'disabled': !settings.showCategories }">
        {{ $t('app.widgets.inventory.settings.show_categories') }}
      </div>
    </div>

    <div v-if="settings.showCategories && settings.categories.length">
      <div class="text-muted small mb-2">{{ $t('app.widgets.inventory.settings.categories') }}</div>
      <div
        v-for="(category, index) in settings.categories"
        :key="index"
        class="d-flex gap-3 mb-2"
      >
        <Toggle
          v-model="category.enabled"
          :onLabel="$t('app.common.on')"
          :offLabel="$t('app.common.off')"
        />
        <div :class="{ 'disabled': !category.enabled }">
          {{ category.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toggle from '@vueform/toggle';

export default {
  name: 'InventorySettings',
  components: {
    Toggle,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  watch: {
    settings: {
      handler(newSettings) {
        localStorage.setItem('inventorySettings', JSON.stringify(newSettings));
      },
      deep: true,
    },
  },
};
</script>

