<template>
  <div class="card mb-0">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="ms-3 active-mission">
          <h4 class="mb-4">Active mission</h4>
          <perfect-scrollbar :class="'ps-active-mission'">
            <div v-if="activeMission.name">
              <h5 class="text-muted mb-2">{{ activeMission.name }}</h5>
              <p class="text-small mb-0" v-html="activeMission.description"></p>
              <div class="text-small mb-0" v-if="activeMission.reward || activeMission.rewardtext ">
                <div class="mt-2"><strong>Reward</strong></div>
                <div class="text-muted text-xs" v-if="activeMission.reward > 0">
                  <font-awesome-icon :icon="'coins'"/>
                  {{ activeMission.reward.toLocaleString() }} Cr
                </div>
                <div class="text-muted text-xs" v-if="activeMission.rewardtext" v-html="activeMission.rewardtext"></div>
              </div>
            </div>
            <div v-else>none</div>
          </perfect-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'activeMission',
  ],
  data() {
    return {}
  },
}
</script>

<style>
</style>