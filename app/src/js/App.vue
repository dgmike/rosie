<template>
  <div class="page">
    <div class="page-title">{{ page.title }}</div>
    Hello from Vue.
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  components: {},
  created() {
    this.$store.state.page = {
      title: 'Dashboard',
    };
  },
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
