<template>
  <div class="input-group">
    <input class="form-control" type="text" placeholder="Message" @keyup='search' v-model="phrase"/>
    <button class="btn btn-outline-secondary rounded-0 search-btn" type="button" @click="clear">
      <font-awesome-icon :icon="icon" />
    </button>
  </div>
</template>

<script>
export default {
  emits: [
    'search'
  ],
  data() {
    return {
      phrase: '',
      icon: 'search'
    }
  },
  methods: {
    /**
     * Reset search
     */
    clear(){
      this.phrase = '';
      this.search();
    },
    /**
     *
     */
    search() {
      this.icon = this.phrase === '' ? 'search' : 'times';
      this.$emit('search', this.phrase)
    }
  }
}
</script>

<style>
</style>