<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Main from './components/Main.vue'
import X4Header from './components/X4Header.vue'</script>
<script>
export default {
  data() {
    return {
      appViewProfile: [1,2,3],
      isPendingUpdate: false,
    }
  },
  methods: {
    /**
     * @param profile
     */
    setAppViewProfile(profile) {
      this.appViewProfile = profile;
    },
    /**
     * @param isPending
     */
    updatePending(isPending) {
      this.isPendingUpdate = isPending;
    }
  },
}
</script>

<template>
  <div>
    <X4-header
        :is-pending-update="isPendingUpdate"
        @setAppViewProfile="setAppViewProfile"/>
    <Main
        :app-profile="appViewProfile"
        @updatePending="updatePending"
    />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Muli:300,400,700');
</style>
