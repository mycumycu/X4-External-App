<template>
  <div class="color-buttons">
    <div class="btn-group" role="group" aria-label="Radio toggle button group">
      <template v-for="(colorValue, colorIndex) in colorClass">
        <input type="radio"
               autocomplete="off"
               class="btn-check"
               :id="`${parentName}_color_${listIndex}_${colorIndex}`"
               :name="`color_${listIndex}`"
               :value="colorValue"
               :checked="current === colorValue"
               v-model="selectedColor">
        <label class="btn btn-color btn-outline-primary"
               :for="`${parentName}_color_${listIndex}_${colorIndex}`"
               :class="[{'selected': current === colorValue}, colorValue]">&nbsp;</label>
      </template>
    </div>
  </div>
</template>

<script>

export default {
  emits: ['colorChange'],
  props: [
    'parentName',
    'listIndex',
    'current'
  ],
  data() {
    return {
      selectedColor: '',
      colorClass: [
        'color-2',
        'color-3',
        'color-1',
        'color-4',
        'color-5',
        'color-6',
        'color-7',
      ]
    }
  },
  watch: {
    selectedColor: function (newColor, oldColor) {
      this.$emit('colorChange', {
        'index': this.listIndex,
        'color': newColor,
      })
    }
  },
}
</script>

<style>
</style>