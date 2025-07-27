<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-sm-8 mt-2">
        <div class="card card-profile mb-4 no-connection">
          <div class="card-header x4-backgound"></div>
          <div class="card-body text-center">
            <img class="card-profile-img" src="../assets/x4-logo.png" :title="$t('app.no_connection.logo_title')" :alt="$t('app.no_connection.logo_alt')"/>
            <div class="mb-2">
              <h3 class="mb-0 text-gray-400 highlighted">
                {{ $t('app.no_connection.waiting_for_connection') }}
              </h3>
              <div class="mb-2">
                {{ $t('app.no_connection.no_water_in_pipe') }}
              </div>
              <small class="pt-2 info">
                {{ $t('app.no_connection.game_data_fetch_error') }}<br />
                {{ $t('app.no_connection.game_save_loaded') }}
              </small>
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
