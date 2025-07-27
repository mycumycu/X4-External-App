<template>
  <div class="col-auto px-lg-0 ps-0 pe-2 d-flex justify-content-center" :style="{color: rgbToHex(entry.color)}">
    <div class="lh-1 px-0 py-1 text-center faction-block" :class="this.exposeClass">
      <span class="d-inline-block licences military" :class="{filled: settings.showLicenceIndicators && entry.hasMilitaryLicence}" :title="$t('app.widgets.factions.licences.military')"></span>
      <span class="d-inline-block licences capital" :class="{filled: settings.showLicenceIndicators && entry.hasCapitalLicence}" :title="$t('app.widgets.factions.licences.capital')"></span>
      <div class="position-relative">{{ entry.shortname }}<sup v-if="settings.showRelationChanges" class="text-muted position-absolute relation-change" :title="$t('app.widgets.factions.relation_change')">{{ getRelationChange() }}</sup></div>
      <span class="relation">&nbsp;&nbsp;{{ getDisplayValue(entry.relation) }}</span></div>
  </div>
</template>

<script>
export default {
  props: [
    'settings',
    'entry',
  ],
  methods: {
    /**
     * @return {string}
     */
    componentToHex(c) {
      let hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    },

    /**
     * @return {string}
     */
    rgbToHex(color) {
      if (color === undefined) {
        return "#fff";
      }
      return "#" + this.componentToHex(color.r) + this.componentToHex(color.g) + this.componentToHex(color.b);
    },
    /**
     * @return {string}
     */
    getDisplayValue(value) {
      if (value > 0) {
        return `+${value}`;
      }
      return value;
    },
    /**
     * @return {string}
     */
    getRelationChange() {
      if (this.relationChange === 0) {
        return '';
      }
      return this.getDisplayValue(this.relationChange);
    },
  },
  watch: {
    entry: {
      /**
       * @param newData Information about the user.
       * @param newData.relation Relation to the faction
       * @param newData.name Faction full name
       * @param newData.shortname Faction shortname
       * @param newData.hasMilitaryLicence If the player has a military licence for the faction
       * @param newData.hasCapitalLicence If the player has a capital licence for the faction
       * @param newData.currentGameTime Current game time
       * @param {object} oldData
       */
      handler(newData, oldData) {
        let timeDifference = newData.currentGameTime - oldData.currentGameTime;
        if (newData.relation !== oldData.relation) {
          this.relationChange = newData.relation - oldData.relation;
          this.exposeClass = 'expose'

          if (this.previousFaction !== newData.shortname || timeDifference < 0 || timeDifference > 30) {
            /*
              in case of:
                * faction change (e.g. when previous faction was hidden in the options)
                * loading a savegame (so the time differs)
              reset the relation change
             */

            this.relationChange = 0;
            this.exposeClass = null;
          }

          setTimeout(() => {
            this.exposeClass = null;
          }, 2000);

        }

        this.previousFaction = newData.shortname;
      },
    },
  },
  computed: {},
  data() {
    return {
      relationChange: 0,
      previousFaction: null,
      exposeClass: null,
    }
  },
}
</script>

<style lang="scss" scoped>
@import "./scss/widget.scss";
</style>
