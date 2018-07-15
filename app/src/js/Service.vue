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
            {{ error.message }}
            <pre>{{ error.stack }}</pre>
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
                  <mdc-layout-cell desktop="2" class="text-right">Nome:</mdc-layout-cell>
                  <mdc-layout-cell desktop="10">{{resource.name}}</mdc-layout-cell>
                </mdc-layout-inner-grid>
                <mdc-layout-inner-grid>
                  <mdc-layout-cell desktop="2" class="text-right">Tipo:</mdc-layout-cell>
                  <mdc-layout-cell desktop="10">{{resource._embedded && resource._embedded.ServiceType && resource._embedded.ServiceType.name}}</mdc-layout-cell>
                </mdc-layout-inner-grid>
                <mdc-layout-inner-grid>
                  <mdc-layout-cell desktop="2" class="text-right">Código-fonte:</mdc-layout-cell>
                  <mdc-layout-cell desktop="10"><a :href="resource.source" target="_blank">{{resource.source}}</a></mdc-layout-cell>
                </mdc-layout-inner-grid>
                <mdc-layout-inner-grid>
                  <mdc-layout-cell desktop="2" class="text-right">Etiquetas:</mdc-layout-cell>
                  <mdc-layout-cell desktop="10">
                    <mdc-list class="tag-list">
                      <mdc-list-item class="tag-list-item" v-for="tag in (resource._embedded && resource._embedded.Tags)" v-bind:key="tag.id">
                        {{tag.name}}
                      </mdc-list-item>
                    </mdc-list>
                  </mdc-layout-cell>
                </mdc-layout-inner-grid>
                <mdc-layout-inner-grid>
                  <mdc-layout-cell desktop="2" class="text-right">Descrição:</mdc-layout-cell>
                  <mdc-layout-cell desktop="10">{{resource.description}}</mdc-layout-cell>
                </mdc-layout-inner-grid>
              </mdc-body>
              <div v-if="selectedTab==1">
                <mdc-title>Arquivos</mdc-title>
                <div v-for="file in files" :key="file.file">
                  <mdc-body>
                    <a :href="file.url" target="_blank">{{file.file}}</a>
                  </mdc-body>
                  <textarea class="file-content" readonly>{{file.text}}</textarea>
                </div>
              </div>
              <transition @enter="showDependencyGraph">
                <div v-if="selectedTab==2">
                  <mdc-title>Relacionamentos</mdc-title>
                  <div id="dependencyGraph"></div>
                </div>
              </transition>
            </mdc-card-text>
          </mdc-card>
        </mdc-layout-cell>
        <mdc-layout-cell desktop="3">
          <mdc-card>
            <mdc-card-text>
              <mdc-title>Dependencias</mdc-title>

              <mdc-list bordered interactive>
                <mdc-list-item>mysql-db.lib</mdc-list-item>
                <mdc-list-item>sinon</mdc-list-item>
                <mdc-list-item>chai</mdc-list-item>
              </mdc-list>
            </mdc-card-text>
          </mdc-card>
        </mdc-layout-cell>
      </mdc-layout-grid>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script>
import dependencyGraph from './dependencyGraph';
import d3 from 'd3/d3';
import $ from 'jquery';

export default {
  data() {
    return {
      loading: false,
      resource: null,
      error: null,
      tabs: [],
      selectedTab: null,
      files: [],
      dependencyData: {},
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

      that.loading = true;
      that.resource = null;
      that.error = null;
      that.tabs = [];
      that.selectedTab = null;
      that.files = [];
      that.dependencyData = {};
      that.$store.state.page.title = 'Serviço...';

      Promise.all([
        fetch(`/api/services/${this.$route.params.id}`),
        fetch(`/api/services/${this.$route.params.id}/files`),
        fetch(`/api/services/${this.$route.params.id}/tree`),
      ])
      .then(results => Promise.all(results.map(result => result.json())))
      .then(([service, files, tree]) => {
        that.loading = false;
        that.files = files._embedded && files._embedded.files;
        that.resource = service;
        that.$store.state.page.title = `Serviço: ${service.name}`;
        that.dependencyData = tree;
        that.tabs = [
          'Dados gerais',
          'Arquivos',
          'Relacionamentos',
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
    },
    goToService(service) {
      this.$router.push({
        name: 'service',
        params: {
          id: service.id,
        },
      });
    },
    showDependencyGraph() {
      const that = this;
      $('#dependencyGraph').html('<svg/>');
      var svg = d3.select('#dependencyGraph svg');

      dependencyGraph(svg, this.dependencyData, (event) => {
        const id = event.id.split('/').pop();
        that.$router.push({
          name: 'service',
          params: { id },
        });
      });
    },
  },
};
</script>

<style lang="scss">
#dependencyGraph {
  .node circle {
    cursor: pointer;
    fill: #fff;
    stroke: steelblue;
    stroke-width: 1.5px;
  }

  .node text {
    font-size: 11px;
    font-family: Menlo, Monaco, sans-serif;
  }

  path.link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;

    &.database {
      stroke: blue;
    }

    &.job {
      stroke: grey;
      stroke-dasharray: 0,2 1;
    }

    &.service {
      stroke: green;
    }

    &.api {
      stroke: lightgreen;
    }

    &.app {
      stroke: purple;
    }
  }
}
</style>

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

  .file-content {
    font-family: monospace;
    width: 100%;
    box-sizing: border-box;
    height: 12rem;
    padding: .5rem;
    resize: none;
  }
}
</style>
