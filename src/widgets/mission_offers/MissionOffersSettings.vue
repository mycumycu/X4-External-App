<template>
  <perfect-scrollbar class="mission-offers-settings-scroll">
    <div class="ms-4 me-3">
      <form>
        <h6 class="mb-4">Difficulties</h6>
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
        <hr/>
        <h6 class="mb-4">Mission types</h6>
        <div class="row">
          <template v-for="(element, typeIndex) in settings.types" :key="typeIndex">
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
        <hr/>
        <h6 class="mb-4">Other settings</h6>
        <div class="row">
          <div class="col-sm-5 p-1 caption">Mission descriptions</div>
          <div class="col-sm-7">
            <select class="form-select" v-model="settings.descriptions">
              <option :value="option.key" v-for="option in descriptionOptions" :key="option.key">{{ option.value }}</option>
            </select>
          </div>
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
      descriptionOptions: [
        {
          key: 0,
          value: 'disabled',
        },
        {
          key: 50,
          value: 'show first 50 chars',
        },
        {
          key: 100,
          value: 'show first 100 chars',
        },
        {
          key: 150,
          value: 'show first 150 chars',
        },
        {
          key: 200,
          value: 'show first 200 chars',
        },
        {
          key: 300,
          value: 'show first 300 chars',
        },
        {
          key: 999999,
          value: 'enabled',
        },
      ]
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

<style lang="scss" scoped>
@import "./scss/settings.scss";
</style>