<template>
  <div class="list-group-item border-start-0 border-end-0 border-top-0 px-lg-0 py-3">
    <div class="d-flex" :class="[{ featured: isFeatured }, colorClass]">
      <div class="ms-12 w-100">
        <div class="d-flex justify-content-between">
          <div>
            <h5 :class="entryTitleClass" class="text-sm" v-html="parsedTitle"></h5>
            <div class="text-sm">{{ entry.eventtypename }}</div>
          </div>
          <div class="flex-shrink-0 text-end right-block">
            <small class="text-nowrap">{{ entry.passedtime }}</small>
            <div class="text-muted text-sm" v-if="entry.money">
              <span :class="[{'red': entry.money < 0}, {'green': entry.money > 0}]">{{ money }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'name',
    'entry',
  ],
  methods: {
    /**
     * @return {boolean}
     */
    isFeatured() {
      return this.entry.rules && this.entry.rules.type === 'featured'
    },
    /**
     * @return {string}
     */
    color(source) {
      const color = source.match(/\#\w{8}\#/g)
      if (Array.isArray(color)) {
        return `#${color[0].slice(3, -1)}`
      }
      return ''
    },
    /**
     * @return {string}
     */
    replaced(color) {
      return color ? `<span style="color: ${color}">` : ''
    }
  },

  computed: {
    /**
     * @return {string|null}
     */
    colorClass() {
      return this.isFeatured() ? this.entry.rules.params.color : null
    },
    /**
     * @return {string}
     */
    entryTitleClass() {
      let classes = [];
      if (this.entry.highlighted) {
        classes.push('highlighted')
      }

      if (this.entry.rules && this.entry.rules.params.blink) {
        classes.push('highlighted')
        classes.push(this.entry.rules.params.color)
      }
      return classes.join(' ');
    },
    /**
     * @return {string}
     */
    parsedTitle() {
      let title = this.entry.partnername;
      return title.replace(/\#\w{8}\#/g, this.replaced(this.color(title)))
    },
    /**
     * @return {string}
     */
    money() {
      return this.entry.money.toLocaleString() + ' ' + this.$t('app.common.credits');
    }
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
@import "./scss/widget.scss";
</style>
