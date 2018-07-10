<template>
  <mdc-layout-grid>
    <mdc-layout-cell desktop="12">
      <mdc-card class="loading" v-if="loading">
          <mdc-card-text>
              Carregando...
          </mdc-card-text>
      </mdc-card>

      <mdc-card class="error" v-if="error">
          <mdc-card-text>
              {{ error }}
          </mdc-card-text>
      </mdc-card>

      <mdc-list class="resources" v-if="resources" interactive bordered two-line>
        <mdc-list-item class="resources-item" v-for="resource in resources.results" :key="resource.id" @click="goToResource(resource)">
          {{resource.name}}
          <span slot="secondary">{{resource._embedded.ServiceType.name}}</span>
        </mdc-list-item>
      </mdc-list>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      resources: null,
      error: null,
    };
  },
  created() {
    this.$store.state.page = {
      title: 'Serviços',
    };
    this.fetchData();
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      const that = this;
      that.error = null;
      that.resources = null;
      that.loading = true;

      fetch('/api/services')
        .then(res => res.json())
        .then(function (json) {
          that.loading = false;
          that.resources = json;
        })
        .catch(function (err) {
          that.error = err;
        });
    },
    goToResource(resource) {
      this.$router.push({
        name: 'service',
        params: {
          id: resource.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.resources {
  .resources-item {
    background: #fff;
    cursor: pointer;
  }
}
</style>
