<template>
  <div class="language-selector d-inline-block position-relative">
    <img
        :src="getFlag(currentLanguage)"
        @click="toggleDropdown"
        class="cursor-pointer"
        :alt="languages[currentLanguage].name"
        :title="$t('app.header.change_language')"
    />
    <transition name="fade">
      <div v-if="show" class="language-options position-absolute">
        <div
            v-for="(lang, code) in otherLanguages"
            :key="code"
            class="language-option py-2"
            @click="change(code)"
        >
          <img :src="getFlag(code)" :alt="lang.name" :title="lang.name" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "LanguageSelector",
  data () {
    return {
      show: false,
      hideTimeout: null,
    };
  },
  computed: {
    ...mapGetters(["getLanguages"]),
    ...mapState(["currentLanguage"]),
    languages () {
      return this.getLanguages;
    },
    otherLanguages () {
      const result = { ...this.languages };
      delete result[this.currentLanguage];
      return result;
    },
  },
  methods: {
    ...mapMutations(["setLanguage"]),
    change (lang) {
      this.setLanguage(lang);
      this.$i18n.locale = lang;
      localStorage.setItem("language", JSON.stringify(lang));
      this.show = false;
    },
    toggleDropdown () {
      this.show = !this.show;
      if (this.show) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
          this.show = false;
        }, 5000);
      }
    },
    getFlag (langCode) {
      const flag = this.languages[langCode]?.flag || langCode;
      return new URL(`../../src/assets/flags/${flag}`, import.meta.url).href;
    },
  },
  mounted () {
    const savedLang = JSON.parse(localStorage.getItem("language"));
    if (savedLang && this.languages[savedLang]) {
      this.setLanguage(savedLang);
      this.$i18n.locale = savedLang;
    }
  },
};
</script>

<style lang="scss" scoped>
.language-selector {
  img {
    border-radius: 50%;
    border: #666 2px solid;
    width: 40px;
    filter: grayscale(70%);
    transition: filter 0.3s ease;
    cursor: pointer;

    &:hover {
      filter: grayscale(0%);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
