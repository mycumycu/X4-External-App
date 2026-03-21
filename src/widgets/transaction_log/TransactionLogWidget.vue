<template>
  <widget>
    <template #header>
      <div class="d-flex justify-content-between">
        <h4 class="card-title pb-3">{{ $t('app.widgets.transaction_log.title') }}</h4>
        <div>
          <font-awesome-icon class="cursor-pointer" :icon="`cogs`" data-bs-toggle="modal" data-bs-target="#transaction-log-setings"/>
          <Modal id="transaction-log-setings" :title="$t('app.widgets.transaction_log.settings_title')" size="modal-xl">
            <TransactionLogSettings :settings="transactionLog.settings"/>
          </Modal>
        </div>
      </div>

      <search-bar @search="filterTransactionLog"/>
    </template>

    <div class="overflow-hidden" style="height: 50px">
          <span v-if="transactionLogExcludedRules.length<=0 && transactionLogFeaturedRules.length<=0">
                        <span class="badge bg-dark text-muted">
                          <I18nT keypath="app.widgets.logbook.adjust_settings">
                            <template #icon><font-awesome-icon :icon="`cogs`" /></template>
                          </I18nT>
                        </span>
                      </span>
      <span class="rules-string d-inline" v-if="transactionLogExcludedRules.length>0">
                    <span class="badge bg-primary me-1">{{ $t('app.widgets.transaction_log.excluded') }}</span>
                    <span v-for="value in transactionLogExcludedRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                  </span>
      <span class="rules-string d-inline" v-if="transactionLogFeaturedRules.length>0">
                    <span class="badge bg-primary me-1">{{ $t('app.widgets.transaction_log.featured') }}</span>
                    <span v-for="value in transactionLogFeaturedRules" class="badge bg-dark me-1 fw-light">{{ value }}</span>
                  </span>
    </div>

    <perfect-scrollbar class="transaction-log resizable-element" data-min-resizable-height="90">
      <transaction-log-entry
          v-for="(entry, name) in transactionLogVisible"
          :name="name"
          :entry="entry"/>
      <div ref="transactionSentinel" style="height: 1px;"></div>
    </perfect-scrollbar>
  </widget>
</template>

<script>

import Widget from "../Widget.vue";
import Modal from "../../components/Modal.vue";
import TransactionLogSettings from "./TransactionLogSettings.vue";
import TransactionLogEntry from "./TransactionLogEntry.vue";
import SearchBar from "../../components/SearchBar.vue";
import {reactive} from "vue";
import {I18nT} from "vue-i18n";

export default {
  components: {
    Modal, TransactionLogSettings, SearchBar, TransactionLogEntry, Widget, I18nT
  },
  props: {
    gameData: Object,
    maxHeight: {
      type: Number,
      default: 100
    },
  },
  mounted() {
    this.$nextTick(() => {
      const sentinel = this.$refs.transactionSentinel;
      if (sentinel) {
        this._transactionObserver = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            this.loadMoreTransactions();
          }
        }, { threshold: 0 });
        this._transactionObserver.observe(sentinel);
      }
    });
  },
  beforeUnmount() {
    if (this._transactionObserver) {
      this._transactionObserver.disconnect();
    }
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
     * Load more entries when sentinel becomes visible
     */
    loadMoreTransactions() {
      if (this.transactionLog.displayCount < this.transactionLog.filtered.length) {
        this.transactionLog.displayCount = Math.min(
            this.transactionLog.displayCount + 100,
            this.transactionLog.filtered.length
        );
      }
    },
    /**
     *
     */
    parseTransactionLogData(gameData) {
      this.transactionLog.list = gameData;
      this.transactionLog.filtered = this.transactionLog.list;
      this.filterTransactionLog(this.transactionLog.searchPhrase, false)
    },
    /**
     * Filter transaction log
     */
    filterTransactionLog(phrase, resetDisplay = true) {
      this.transactionLog.searchPhrase = phrase.toLowerCase();
      let filtered = [];
      this.transactionLog.filtered = this.transactionLog.list;
      for (const key in this.transactionLog.list) {
        let value = this.transactionLog.filtered[key];
        let partnername = value.partnername.toLowerCase();
        let eventtypename = value.eventtypename.toLowerCase();
        let money = value.money;

        value.rules = null;
        // apply rules
        this.transactionLog.settings.rules.some(element => {
          let elementPhrase = element.phrase.toLowerCase();
          if (
              element.enabled &&
              (!element.lessThan || money < element.lessThan) &&
              (!element.moreThan || money > element.moreThan) &&
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
      if (resetDisplay) {
        this.transactionLog.displayCount = Math.min(100, filtered.length);
      } else {
        this.transactionLog.displayCount = Math.min(this.transactionLog.displayCount, filtered.length);
      }
    },
  },
  computed: {
    /**
     * Lazy-loaded subset of filtered entries
     */
    transactionLogVisible() {
      return this.transactionLog.filtered.slice(0, this.transactionLog.displayCount);
    },
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
        displayCount: 100,
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

<style lang="scss" scoped>
@import "./scss/widget.scss";
</style>
