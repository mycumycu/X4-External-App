<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-sm-8 mt-2">
        <div class="card card-profile mb-4 no-connection">
          <div class="card-header x4-backgound"></div>
          <div class="card-body text-center">
            <img class="card-profile-img" src="../assets/x4-logo.png" title="..." alt="X4 logo"/>
            <div class="mb-2">
              <h3 class="mb-0 text-gray-400 highlighted">
                Waiting for connection
              </h3>
              <div class="mb-2">
                There's no water in the pipe...
              </div>
              <small class="pt-2 info">Check if SirNuke's Python Pipe Server and X4 External App are both running.<br/>Game should also be loaded.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: [],
  data() {
    return {}
  },
}
</script>

<style>
</style>