<template>
  <div class="card card-profile mt-4">
    <div class="card-header x4-backgound"></div>
    <div class="card-body text-center resizable-element" data-min-resizable-height="190">
      <img class="card-profile-img" src="../../assets/x4-logo.png" title="..."/>
      <div class="mb-2">
        <h3 class="mb-0 text-gray-400">
          <span>{{ player.name }}</span>
        </h3>
        <small v-if="player.faction">{{ player.faction }}</small>
        <div v-else>&nbsp;</div>
      </div>
      <div class="mb-4">
        <div v-if="player.sector">{{ player.sector }}</div>
        <div>{{ player.credits }}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: [
    'gameData',
    'maxHeight',
  ],
  data() {
    return {
      player: {
        name: null,
        faction: null,
        sector: null,
        credit: null,
      },
    }
  },
  /**
   */
  watch: {
    'gameData': {
      handler(newData, oldData) {
        this.parsePlayerProfileData(newData)
      },
    },
  },
  methods: {
    /**
     */
    parsePlayerProfileData(gameData) {
      this.player = {
        name: gameData.name,
        faction: gameData.factionname,
        sector: gameData.playersector,
        credits: gameData.credits.toLocaleString() + ' Cr',
      }
    },
  },
}
</script>

<style>
</style>