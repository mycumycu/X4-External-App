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
              <small class="pt-2 info">Server couldn't get data from the game. <br/>Game save should be loaded. Also check if server port matches mod config setting.</small>
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

<style lang="scss">
.no-connection {
  .info {
    display: block;
    color: #fff;
  }
  .highlighted {
    -webkit-animation: blink 3s infinite both;
    animation: blink 3s infinite both;
  }
}
</style>