<template>
  <div class="card mt-4">
    <div class="card-header">
      <div class="d-flex justify-content-between">
        <div><h4 class="card-title pb-3">Transaction Log</h4></div>
        <div>
          <font-awesome-icon class="cursor-pointer" :icon="`cogs`" data-bs-toggle="modal" data-bs-target="#transaction-log-setings"/>
          <Modal id="transaction-log-setings" title="Transaction log settings" size="modal-lg">
            <TransactionLogSettings :settings="transactionLog.settings"/>
          </Modal>
        </div>
      </div>

      <search-bar @search="filterTransactionLog"/>
    </div>
    <div class="list-group-item border-start-0 border-end-0 border-bottom-0 py-2 px-lg-4">
      <div class="d-flex flex-column">
        <div class="overflow-hidden" style="height: 50px">
          <span v-if="transactionLogExcludedRules.length<=0 && transactionLogFeaturedRules.length<=0">
                        <span class="badge bg-dark text-muted">Adjust transaction log settings using <font-awesome-icon :icon="`cogs`"/> icon above.</span>
                      </span>
          <span class="rules-string d-inline" v-if="transactionLogExcludedRules.length>0">
                        <span class="badge bg-primary me-1">Excluded</span>
                        <span v-for="value in transactionLogExcludedRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                      </span>
          <span class="rules-string d-inline" v-if="transactionLogFeaturedRules.length>0">
                        <span class="badge bg-primary me-1">Featured</span>
                        <span v-for="value in transactionLogFeaturedRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                      </span>
        </div>
        <div class="transaction-log">
          <perfect-scrollbar :class="'resizable-element'" data-min-resizable-height="90">
            <transaction-log-entry
                v-for="(entry, name) in transactionLog.filtered"
                :name="name"
                :entry="entry"/>
          </perfect-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Modal from "../../components/Modal.vue";
import TransactionLogSettings from "./TransactionLogSettings.vue";
import TransactionLogEntry from "./TransactionLogEntry.vue";
import SearchBar from "../../components/SearchBar.vue";
import {reactive} from "vue";

export default {
  components: {
    Modal, TransactionLogSettings, SearchBar, TransactionLogEntry
  },
  props: {
    gameData: Object,
    maxHeight: {
      type: Number,
      default: 100
    },
  },
  /**
   */
  watch: {
    gameData: {
      handler(newData, oldData) {
        this.parseTransactionLogData(newData)
      },
    },
    'transactionLog.settings': {
      handler(newList, oldList) {
        this.filterTransactionLog(this.transactionLog.searchPhrase)
      },
      deep: true
    },
  },
  methods: {
    /**
     *
     */
    parseTransactionLogData(gameData) {
      this.transactionLog.list = gameData;
      this.transactionLog.filtered = this.transactionLog.list;
      this.filterTransactionLog(this.transactionLog.searchPhrase)
    },
    /**
     * Filter transaction log
     */
    filterTransactionLog(phrase) {
      this.transactionLog.searchPhrase = phrase.toLowerCase();
      let filtered = [];
      this.transactionLog.filtered = this.transactionLog.list;
      for (const key in this.transactionLog.list) {
        let value = this.transactionLog.filtered[key];
        let partnername = value.partnername.toLowerCase();
        let eventtypename = value.eventtypename.toLowerCase();

        value.rules = null;
        // apply rules
        this.transactionLog.settings.rules.some(element => {
          let elementPhrase = element.phrase.toLowerCase();
          if (
              element.enabled &&
              elementPhrase !== '' && (
                  partnername.includes(elementPhrase) ||
                  !element.params.titleonly &&
                  (
                      eventtypename.includes(elementPhrase)
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
                (partnername.includes(this.transactionLog.searchPhrase) || eventtypename.includes(this.transactionLog.searchPhrase)) &&
                (
                    !value.rules ||
                    value.rules.type !== 'excluded'
                )
            )
        ) {

          filtered.push(value)
        }
      }
      this.transactionLog.filtered = filtered;
    },
  },
  computed: {
    /**
     * @return {*}
     */
    transactionLogExcludedRules() {
      return this.transactionLog.settings.rules.filter((item => {
        return item.type === 'excluded' && item.phrase !== '' && item.enabled;
      })).map(item => {
        return item.phrase.toLowerCase();
      });
    },

    /**
     * @return {*}
     */
    transactionLogFeaturedRules() {
      return this.transactionLog.settings.rules.filter((item => {
        return item.type === 'featured' && item.phrase !== '' && item.enabled;
      })).map(item => {
        return item.phrase.toLowerCase();
      });
    },
  },
  /**
   * @returns {{transactionLog: {settings: UnwrapNestedRefs<any|{rules: *[]}>, filtered: *[], searchPhrase: string, list: *[]}}}
   */
  data() {
    return {
      transactionLog: {
        list: [],
        filtered: [],
        searchPhrase: '',
        settings: reactive(
            JSON.parse(localStorage.getItem("transactionLogSettings")) || {
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