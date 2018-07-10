<template>
  <mdc-layout-grid>
    <mdc-layout-cell desktop="12">
      <mdc-card class="loading" v-if="loading">
          <mdc-card-text>
              Carregando...
          </mdc-card-text>
      </mdc-card>
      <div v-else>
        <mdc-layout-grid>
          <mdc-layout-cell span="9"></mdc-layout-cell>
          <mdc-layout-cell span="3">
            <mdc-textfield v-model="search" label="Buscar" fullwidth trailing-icon="search" @keypress.enter="handleSearchEnterKey"/>
          </mdc-layout-cell>
        </mdc-layout-grid>

        <mdc-card class="error" v-if="error">
            <mdc-card-text>
                {{ error.message }}
            </mdc-card-text>
        </mdc-card>

        <div v-if="resources">
          <mdc-list class="resources" v-if="resources.total" interactive bordered two-line>
            <mdc-list-item class="resources-item" v-for="resource in resources.results" :key="resource.id" @click="goToResource(resource)">
              {{resource.name}}
              <span slot="secondary">{{resource._embedded.ServiceType.name}}</span>
            </mdc-list-item>
          </mdc-list>
          <mdc-card class="error" v-else>
            <mdc-card-text>
              <p>Nenhum resultado encontrado.</p>
            </mdc-card-text>
          </mdc-card>
        </div>
      </div>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import url from 'url';

export default {
  data() {
    return {
      loading: false,
      resources: null,
      error: null,
      search: '',
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
    fetchData(search = {}) {
      const that = this;

      that.error = null;

      const timeout = setTimeout(() => {
        that.resources = null;
        that.loading = true;
      }, 200);

      const url = new URL('/api/services', new URL(location).origin);
      url.search = new URLSearchParams(search);

      fetch(url.href)
        .then((res) => { clearTimeout(timeout); return res; })
        .then(res => res.json())
        .then(function (json) {
          that.resources = json;
        })
        .catch(function (err) {
          that.error = err;
          that.resources = null;
        })
        .finally(() => {
          clearTimeout(timeout);
          that.loading = false;
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
    handleSearchEnterKey() {
      this.fetchData({ name: this.search });
    }
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
