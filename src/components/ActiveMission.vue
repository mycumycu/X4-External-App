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
              <p class="text-small mb-0"><strong v-if="activeMission.reward">Reward:</strong> <span>{{ activeMission.reward }}</span></p>
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