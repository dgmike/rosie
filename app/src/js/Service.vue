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

      <mdc-layout-grid v-if="resource" class="content">
        <mdc-layout-cell desktop="9">
          <mdc-card>
            <mdc-card-text>
              <mdc-tab-bar v-if="tabs.length" @change="changeTab">
                <mdc-tab v-for="(tab, index) in tabs" v-bind:key="index">
                  {{tab}}
                </mdc-tab>
              </mdc-tab-bar>
              <mdc-body v-if="selectedTab==0">
                <mdc-layout-inner-grid>
                  <mdc-layout-cell desktop="2" class="text-right">Nome</mdc-layout-cell>
                  <mdc-layout-cell desktop="10">{{resource.name}}</mdc-layout-cell>
                </mdc-layout-inner-grid>
                <mdc-layout-inner-grid>
                  <mdc-layout-cell desktop="2" class="text-right">Tipo</mdc-layout-cell>
                  <mdc-layout-cell desktop="10">{{resource._embedded.ServiceType.name}}</mdc-layout-cell>
                </mdc-layout-inner-grid>
                <mdc-layout-inner-grid>
                  <mdc-layout-cell desktop="2" class="text-right">Código-fonte</mdc-layout-cell>
                  <mdc-layout-cell desktop="10">https://gitlab.devel/xpto</mdc-layout-cell>
                </mdc-layout-inner-grid>
                <mdc-layout-inner-grid>
                  <mdc-layout-cell desktop="2" class="text-right">Etiquetas</mdc-layout-cell>
                  <mdc-layout-cell desktop="10">
                    <mdc-list class="tag-list">
                      <mdc-list-item class="tag-list-item">Uno</mdc-list-item>
                      <mdc-list-item class="tag-list-item">Dos</mdc-list-item>
                      <mdc-list-item class="tag-list-item">Tres</mdc-list-item>
                    </mdc-list>
                  </mdc-layout-cell>
                </mdc-layout-inner-grid>
                <mdc-layout-inner-grid>
                  <mdc-layout-cell desktop="2" class="text-right">Descrição</mdc-layout-cell>
                  <mdc-layout-cell desktop="10">{{resource.description}}</mdc-layout-cell>
                </mdc-layout-inner-grid>
              </mdc-body>
              <div v-if="selectedTab==1">Aba 1</div>
              <div v-if="selectedTab==2">Aba 2</div>
            </mdc-card-text>
          </mdc-card>
        </mdc-layout-cell>
        <mdc-layout-cell desktop="3">
          <mdc-card>
            <mdc-card-text>
              <mdc-title>Dependencias</mdc-title>
            </mdc-card-text>
          </mdc-card>
        </mdc-layout-cell>
      </mdc-layout-grid>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      resource: null,
      error: null,
      tabs: [],
      selectedTab: null,
    };
  },
  created() {
    this.$store.state.page = {
      title: 'Serviço...',
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

      fetch(`/api/services/${this.$route.params.id}`)
        .then(res => res.json())
        .then(function (json) {
          that.loading = false;
          that.resource = json;
          that.$store.state.page.title = `Serviço: ${json.name}`;
          that.tabs = [
            'Dados gerais',
            'Arquivos',
            'Consultório',
            'Monitoria',
            'Responsáveis',
          ];
          that.selectedTab = 0;
        })
        .catch(function (err) {
          that.error = err;
        });
    },
    changeTab(idx) {
      this.selectedTab = idx;
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  .tag-list {
    padding-top: 0;

    .tag-list-item {
      height: auto;
      padding-left: 0;
      display: inline;
    }
  }

  .text-right {
    text-align: right;
  }
}
</style>
