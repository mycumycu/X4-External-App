<template>
  <perfect-scrollbar class="mission-offers-settings-scroll">
    <div class="ms-4 me-3">
      <form>
        <div class="row">
          <template v-for="(element, listIndex) in settings.difficulties" :key="listIndex">
            <div class="col-3 mb-2 text-end">
              <Toggle
                  v-model="element.enabled"
                  onLabel="on"
                  offLabel="off"/>
            </div>
            <div class="col-3 mb-2" :class="{'disabled': !element.enabled}">
              <span class="badge bg-primary">{{ element.name }}</span>
            </div>
          </template>
        </div>
      </form>

    </div>
  </perfect-scrollbar>
</template>

<script>
import Toggle from '@vueform/toggle'

export default {
  components: {
    Toggle,
  },
  props: ['settings'],
  data() {
    return {
      value: false,
    }
  },
  /**
   */
  watch: {
    settings: {
      handler(newList, oldList) {
        localStorage.setItem("missionOffersSettings", JSON.stringify(newList));
      },
      deep: true
    },
  },
  /**
   */
  methods: {},
}
</script>

<style src="../../../node_modules/@vueform/toggle/themes/default.css"></style>
<style lang="scss">
.disabled {
  opacity: 0.5;
}
</style>