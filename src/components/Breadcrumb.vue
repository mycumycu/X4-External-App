<template>
  <div class="container-fluid" :class="[ compact ? 'pt-1 pb-1 px-2' : 'container-fluid pt-2 pb-0' ]">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb mb-0 px-0" :class="[ compact ? 'pt-1' : 'pt-3' ]">
        <li class="breadcrumb-item"><a href="index.html">X4</a></li>
        <li class="breadcrumb-item active" aria-current="page">home</li>
      </ol>
    </nav>
  </div>
</template>

<script>
export default {
  inject: ['compact'],
  /**
   * @returns {{}}
   */
  data() {
    return {}
  },
}
</script>

<style>
</style>