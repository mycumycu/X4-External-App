<template>
  <div class="list-group-item border-start-0 border-end-0 border-top-0 px-lg-0 py-3">
    <div class="d-flex" :class="[{ featured: isFeatured }, colorClass()]">
      <div class="ms-12 w-100">
        <div class="d-flex justify-content-between">
          <h5 :class="entryTitleClass()" class="title" v-html="entry.title"></h5>
          <small class="text-nowrap">{{ entry.passedtime }}</small>
        </div>
        <div class="text-muted text-sm" v-html="entry.text"></div>
        <div class="mt-2">
          <div class="text-muted text-sm" v-if="entry.factionname">
            <font-awesome-icon :icon="'user-friends'" :class="`fa-icon`"/>
            {{ entry.factionname }}
          </div>
          <div class="text-muted text-sm" v-if="entry.money >0">
            <font-awesome-icon :icon="'coins'" :class="`fa-icon`"/>
            {{ entry.money.toLocaleString() }} Cr
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
      return this.entry.rules && this.entry.rules.type === 'featured';
    },
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
  },
  data() {
    return {}
  },
}
</script>

<style>
</style>