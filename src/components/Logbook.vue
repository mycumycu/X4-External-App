<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between">
        <div><h4 class="card-title pb-3">Logbook</h4></div>
        <div>
          <font-awesome-icon class="cursor-pointer" :icon="`cogs`" data-bs-toggle="modal" data-bs-target="#logbook-setings"/>
          <Modal id="logbook-setings" title="Logbook settings" size="modal-lg">
            <LogbookSettings :settings="logbook.settings"/>
          </Modal>
        </div>
      </div>

      <search-bar @search="filterLogbook"/>
    </div>
    <div class="list-group-item border-start-0 border-end-0 border-bottom-0 py-2 px-lg-4">
      <div class="d-flex flex-column">
        <div class="overflow-hidden" style="height: 50px">
                      <span v-if="logbookExcludedRules.length<=0 && logbookFeaturedRules.length<=0">
                        <span class="badge bg-secondary">Adjust logbook settings using <font-awesome-icon :icon="`cogs`"/> icon above.</span>
                      </span>
          <span class="rules-string d-inline" v-if="logbookExcludedRules.length>0">
                        <span class="badge bg-primary me-1">Excluded</span>
                        <span v-for="value in logbookExcludedRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                      </span>
          <span class="rules-string d-inline" v-if="logbookFeaturedRules.length>0">
                        <span class="badge bg-primary me-1">Featured</span>
                        <span v-for="value in logbookFeaturedRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                      </span>
        </div>
        <div class="logbook">
          <perfect-scrollbar :class="'ps-logbook'">
            <logbook-entry
                v-for="(entry, name) in logbook.filtered"
                :name="name"
                :entry="entry"/>
          </perfect-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Modal from "./Modal.vue";
import LogbookSettings from "./LogbookSettings.vue";
import LogbookEntry from "./LogbookEntry.vue";
import SearchBar from "./SearchBar.vue";
import {reactive} from "vue";

export default {
  components: {
    Modal, LogbookSettings, SearchBar, LogbookEntry
  },
  props: [
      'gameData'
  ],
  /**
   */
  watch: {
    'gameData': {
      handler(newData, oldData) {
        this.parseLogbookData(newData)
      },
    },
    'logbook.settings': {
      handler(newList, oldList) {
        this.filterLogbook(this.logbook.searchPhrase)
      },
      deep: true
    },
  },
  methods: {
    /**
     *
     */
    parseLogbookData(gameData) {
      this.logbook.list = gameData;
      this.logbook.filtered = this.logbook.list;
      this.filterLogbook(this.logbook.searchPhrase)
    },
    /**
     * Filter logbook
     */
    filterLogbook(phrase) {
      this.logbook.searchPhrase = phrase.toLowerCase();
      let filtered = [];
      this.logbook.filtered = this.logbook.list;
      for (const key in this.logbook.list) {
        let value = this.logbook.filtered[key];
        let title = value.title.toLowerCase();
        let text = value.text.toLowerCase();
        let faction = value.factionname.toLowerCase();

        value.rules = null;
        // apply rules
        this.logbook.settings.rules.some(element => {
          let elementPhrase = element.phrase.toLowerCase();
          if (
              element.enabled &&
              elementPhrase !== '' && (
                  title.includes(elementPhrase) ||
                  !element.params.titleonly &&
                  (
                      text.includes(elementPhrase) ||
                      faction.includes(elementPhrase)
                  )
              )
          ) {
            value.rules = element;
            return true;
          }
        });

        if (
            value &&
            (
                (title.includes(this.logbook.searchPhrase) || text.includes(this.logbook.searchPhrase) || faction.includes(this.logbook.searchPhrase)) &&
                (
                    !value.rules ||
                    value.rules.type !== 'excluded'
                )
            )
        ) {

          filtered.push(value)
        }
      }
      this.logbook.filtered = filtered;
    },
  },
  computed: {
    /**
     * @return {*}
     */
    logbookExcludedRules() {
      return this.logbook.settings.rules.filter((item => {
        return item.type === 'excluded' && item.phrase !== '';
      })).map(item => {
        return item.phrase.toLowerCase();
      });
    },

    /**
     * @return {*}
     */
    logbookFeaturedRules() {
      return this.logbook.settings.rules.filter((item => {
        return item.type === 'featured' && item.phrase !== '';
      })).map(item => {
        return item.phrase.toLowerCase();
      });
    },

  },
  data() {
    return {
      logbook: {
        list: [],
        filtered: [],
        searchPhrase: '',
        settings: reactive(
            JSON.parse(localStorage.getItem("logbookSettings")) || {
              rules: []
            }
        ),
      },

    }
  },
}
</script>

<style>
</style>