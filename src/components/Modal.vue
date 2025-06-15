<template>
  <!-- Modal -->
  <div class="modal fade" :id="this.id" tabindex="-1" aria-labelledby="" aria-hidden="true">
    <div class="modal-dialog" :class="this.size">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title p-2" v-html="this.title"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="$t('app.common.close')">
            <font-awesome-icon class="cursor-pointer" :icon="'times'"/>
          </button>
        </div>
        <div class="modal-body p-4">
          <slot></slot>
        </div>
<!--        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id', 'title', 'size'],
  data() {
    return {}
  },
}
</script>

<style>
</style>
