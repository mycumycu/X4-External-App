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
          <li class="list-inline-item dropdown px-lg-2">
            <a class="nav-link text-reset px-1 pe-3 font-size" href="#" title="Change font size" @click="changeFontSize">
              <font-awesome-icon class="cursor-pointer" :icon="'font'"/>
            </a>
            <a class="nav-link text-reset px-1 pe-4 set-profile" href="#" data-bs-toggle="modal" data-bs-target="#layout-setings" aria-haspopup="true" aria-expanded="false" title="Change layout">
              <font-awesome-icon class="cursor-pointer" :icon="'th-large'"/>
            </a>
            <a class="nav-link text-reset px-1 px-lg-0 font-size" href="#" title="Toggle fullscreen" @click="toggleFullscreen">
              <font-awesome-icon class="cursor-pointer" :icon="'expand'"/>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <Modal id="layout-setings" title="Layout settings" size="modal-xl">
    <LayoutSettings/>
  </Modal>
</template>

<script>
import Modal from "../components/Modal.vue";
import LayoutSettings from "./LayoutSettings.vue";

export default {
  components: {
    LayoutSettings,
    Modal
  },
  props: ['isPendingUpdate'],
  emits: ['resizeWidgets'],
  data() {
    return {
      htmlClassArray: [
        'font-size-1',
        'font-size-2',
        'font-size-3',
      ],
      htmlClassIndex: 0,
      isFullscreen: false,
    }
  },
  methods: {
    /**
     *
     */
    async changeFontSize() {
      this.htmlClassIndex = this.htmlClassIndex < this.htmlClassArray.length - 1 ? this.htmlClassIndex + 1 : 0;
      this.setFontSize();
      this.emitter.emit('resizeWidgets')
    },

    /**
     */
    toggleFullscreen() {
      !this.isFullscreen ? document.documentElement.requestFullscreen() : document.exitFullscreen();
      this.isFullscreen = !this.isFullscreen;

      setTimeout(() => {
        this.emitter.emit('resizeWidgets')
      }, 500);

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