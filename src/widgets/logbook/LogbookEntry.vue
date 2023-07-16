<template>
  <div class="list-group-item border-start-0 border-end-0 border-top-0 px-lg-0 py-3">
    <div class="d-flex" :class="[{ featured: isFeatured }, colorClass]">
      <div class="ms-12 w-100">
        <div class="d-flex justify-content-between">
          <h5 :class="entryTitleClass" class="title" v-html="parsedTitle"></h5>
          <small class="text-nowrap">{{ entry.passedtime }}</small>
        </div>
        <div class="text-muted text-sm" v-html="parsedText"></div>
        <div class="mt-2">
          <div class="text-muted text-sm" v-if="entry.factionname">
            <font-awesome-icon :icon="'user-friends'" :class="`fa-icon`"/>
            {{ entry.factionname }}
          </div>
          <div class="text-muted text-sm" v-if="entry.money >0">
            <font-awesome-icon :icon="'coins'" :class="`fa-icon`"/>
            {{ creditsWithBonus }}
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
      if (this.entry.highlighted){
        classes.push('highlighted')
      }

      if (this.entry.rules && this.entry.rules.params.blink){
        classes.push('highlighted')
        classes.push(this.entry.rules.params.color)
      }
      return classes.join(' ');
    },
    /**
     * @return {string}
     */
    parsedTitle() {
      return this.entry.title.replace(/\#\w{8}\#/g, this.replaced(this.color(this.entry.title)))
    },
    /**
     * @return {string}
     */
    parsedText() {
      return this.entry.text.replace(/\#\w{8}\#/g, this.replaced(this.color(this.entry.text)))
    },
    creditsWithBonus(){
      if (!this.entry.bonus){
        return this.entry.money.toLocaleString() + ' Cr';
      }
      const withBonus = this.entry.money + this.entry.bonus;
      return withBonus.toLocaleString() + ' Cr (base ' + this.entry.money.toLocaleString() + ' Cr + bonus ' + this.entry.bonus.toLocaleString() + ' Cr)';
    }
  },
  data() {
    return {}
  },
}
</script>

<style>
</style>
