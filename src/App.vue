<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Main from './components/Main.vue'
import X4Header from './components/X4Header.vue'</script>
<script>
export default {
  data() {
    return {
      profile: 1
    }
  },
  methods: {
    /**
     * @param profile
     */
    setProfile(profile) {
      this.profile = profile;
    }
  },
}
</script>

<template>
  <div>
    <X4-header @setProfile="setProfile"></X4-header>
    <Main
        :appProfile="profile"
    />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Muli:300,400,700');
</style>
