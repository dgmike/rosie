<template>
  <div class="page">
    <div class="page-title">{{ page.title }}</div>

    <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
    <router-link :to="{ name: 'services' }">Serviços</router-link>

    <router-view></router-view>
    <footer>
      Rodapé
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  components: {},
  computed: mapState(['page']),
};
</script>

<style lang="scss" scoped>
.page {
  font-family: Tahoma, sans-serif;

  .page-title {
    font-size: 2rem;
  }
}
</style>
