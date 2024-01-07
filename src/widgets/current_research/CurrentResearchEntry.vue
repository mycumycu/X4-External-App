<template>
  <div class="row">
    <div class="col-7">
      <h5 class="text-muted mb-0">{{ research.name }}</h5>
    </div>
    <div class="col-5 text-end small mb-4 researchtime">
      Research time: {{ research.researchtime }}
      (completed {{ research.percentageCompleted }}%)<br/>
    </div>
  </div>

  <p class="mb-0">{{ research.description }}</p>
  <div class="text-small mb-0">
    <div v-if="research.precursors">
      <div class="mt-2"><strong>Tasks required</strong></div>
      <div class="text-muted text-xs" v-for="precursor in research.precursors">
        {{ precursor.name }}
      </div>
    </div>
    <div v-if="research.resources">
      <div class="mt-2"><strong>Required resources</strong></div>
      <div class="row text-muted text-xs" v-for="resource in research.resources">
        <div class="col-8 offset-sm-0 ps-4">{{ resource.name }}</div>
        <div class="col-4 text-end d-sm-none d-md-block">
          <div class="progress position-relative">
            <div class="progress-label w-100 pe-2">{{ resource.currentAmount }} / {{ resource.totalAmount }}</div>
            <div class="progress-bar" role="progressbar" :style="{ width: calculateProgress(resource)} " aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'research'
  ],
  /**
   * @returns {{}}
   */
  data() {
    return {}
  },
  /**
   */
  computed: {},
  methods: {
    calculateProgress(resource) {
      let value = (resource.currentAmount / resource.totalAmount) * 100;
      return `${value}%`;
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "scss/widget.scss";
</style>