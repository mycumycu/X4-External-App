<template>
  <header class="header">
    <nav class="navbar navbar-expand-lg py-2 bg-dash-dark-2 border-bottom border-dash-dark-1 z-index-10">
      <div class="container-fluid d-flex align-items-center justify-content-between py-1">
        <div class="navbar-header d-flex align-items-center"><a class="navbar-brand text-uppercase text-reset" href="index.html">
          <div class="brand-text brand-big"><strong class="text-primary">X4</strong><strong>External<span>App</span></strong></div>
          <div class="brand-text brand-sm"><strong class="text-primary">X4</strong><strong>APP</strong></div>
        </a>
        </div>
        <div v-if="this.isPendingUpdate">{{ $t('app.header.new_version') }} <a href="https://github.com/mycumycu/X4-External-App/releases" target="_blank">{{ $t('app.header.download_from_github') }}</a></div>
        <ul class="list-inline mb-0">
          <li class="list-inline-item dropdown px-lg-2 d-flex align-items-center">
            <a class="nav-link text-reset px-1 pe-3 font-size" href="#" :title="$t('app.header.change_font_size')" @click="changeFontSize">
              <font-awesome-icon class="cursor-pointer" :icon="'font'"/>
            </a>
            <a class="nav-link text-reset px-1 pe-4 set-profile" href="#" data-bs-toggle="modal" data-bs-target="#layout-setings" aria-haspopup="true" aria-expanded="false" :title="$t('app.header.change_layout')">
              <font-awesome-icon class="cursor-pointer" :icon="'th-large'"/>
            </a>
            <a class="nav-link text-reset px-1 pe-4 font-size" href="#" :title="$t('app.header.toggle_fullscreen')" @click="toggleFullscreen">
              <font-awesome-icon class="cursor-pointer" :icon="'expand'"/>
            </a>
            <LanguageSelector />
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <Modal id="layout-setings" :title="$t('app.header.settings')" size="modal-xl">
    <Settings/>
  </Modal>
</template>

<script>
import Modal from "../components/Modal.vue";
import Settings from "./Settings.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";

export default {
  components: {
    LanguageSelector,
    Settings,
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

<style lang="scss">
.brand-text {
  span {
    color: #999;
  }
}
.set-profile {
  font-size: 20px;
}
</style>
