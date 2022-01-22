<template>
  <header class="header">
    <nav class="navbar navbar-expand-lg py-2 bg-dash-dark-2 border-bottom border-dash-dark-1 z-index-10">
      <div class="container-fluid d-flex align-items-center justify-content-between py-1">
        <div class="navbar-header d-flex align-items-center"><a class="navbar-brand text-uppercase text-reset" href="index.html">
          <div class="brand-text brand-big"><strong class="text-primary">X4</strong><strong>External<span>App</span></strong></div>
          <div class="brand-text brand-sm"><strong class="text-primary">X4</strong><strong>APP</strong></div>
        </a>
        </div>
        <div v-if="this.isPendingUpdate">New version is out. <a href="https://github.com/mycumycu/X4-External-App/releases" target="_blank">Download it from github.</a></div>
        <ul class="list-inline mb-0">
          <!-- Profiles dropdown -->
          <li class="list-inline-item dropdown px-lg-2">
            <a class="nav-link text-reset px-1 pe-3 font-size" href="#" title="change font size" @click="changeFontSize">
              <font-awesome-icon class="cursor-pointer" :icon="'font'"/>
            </a>
            <a class="nav-link text-reset px-1 px-lg-0 set-profile" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="switch profile">
              <font-awesome-icon class="cursor-pointer" :icon="'th-large'"/>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="navbarDropdownMenuLink1">
              <li><a class="dropdown-item d-flex align-items-center" href="#" @click="setAppViewProfile([1,2,3])">
                <div class="ms-3"><strong class="d-block">Set profile #1</strong><span class="d-block text-xs">User profile / Mission offers / Logbook</span></div>
              </a></li>
              <li><a class="dropdown-item d-flex align-items-center" href="#" @click="setAppViewProfile([3,2,1])">
                <div class="ms-3"><strong class="d-block">Set profile #2</strong><span class="d-block text-xs">Logbook / Mission offers / User profile</span></div>
              </a></li>
              <li><a class="dropdown-item d-flex align-items-center" href="#" @click="setAppViewProfile([2,1,3])">
                <div class="ms-3"><strong class="d-block">Set profile #3</strong><span class="d-block text-xs">Mission offers / User profile / Logbook</span></div>
              </a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  props: ['isPendingUpdate'],
  emits: ['setAppViewProfile'],
  data() {
    return {
      htmlClassArray: [
        'font-size-1',
        'font-size-2',
        'font-size-3',
      ],
      htmlClassIndex: 0,
    }
  },
  methods: {
    /**
     * @param profile
     */
    setAppViewProfile(profile) {
      this.$emit('setAppViewProfile', profile)
    },
    /**
     *
     */
    changeFontSize() {
      this.htmlClassIndex = this.htmlClassIndex < this.htmlClassArray.length - 1 ? this.htmlClassIndex + 1 : 0;
      this.setFontSize();
    },

    /**
     */
    setFontSize() {
      let htmlElement = document.querySelector('html');
      htmlElement.className = '';
      htmlElement.classList.add(this.htmlClassArray[this.htmlClassIndex]);
      localStorage.setItem("fontSizeIndex", JSON.stringify(this.htmlClassIndex));
    }
  },
  /**
   */
  mounted() {
    this.htmlClassIndex = parseInt(JSON.parse(localStorage.getItem("fontSizeIndex")) || 0)
    this.setFontSize();
  }
}
</script>

<style>
</style>