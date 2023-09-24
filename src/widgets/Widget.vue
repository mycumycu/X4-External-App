<template>
  <div class="card" :class="[ compact ? 'mt-1' : 'mt-4' ]">
    <div class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body pt-0">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['compact'],
}
</script>
