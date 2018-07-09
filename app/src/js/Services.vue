<template>
<div>
  <div class="loading" v-if="loading">
    Loading...
  </div>

  <div class="error" v-if="error">
    {{ error }}
  </div>

  <div class="resources" v-if="resources">
    <table>
      <thead>
        <tr>
          <th>Nome</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in resources.results">
          <td>{{resource.name}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
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
  },
};
</script>
