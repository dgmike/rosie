<template>
  <div class="page">
    <mdc-layout-app>
      <mdc-toolbar slot="toolbar">
        <mdc-toolbar-row>
          <mdc-toolbar-section align-start >
            <mdc-toolbar-menu-icon event="toggle-drawer"></mdc-toolbar-menu-icon>
            <mdc-toolbar-title>{{ page.title }}</mdc-toolbar-title>
          </mdc-toolbar-section>
        </mdc-toolbar-row>
      </mdc-toolbar>
      <mdc-drawer slot="drawer" persistent toggle-on="toggle-drawer">
        <mdc-drawer-list>
          <mdc-drawer-item start-icon="dashboard" :to="{ name: 'dashboard' }">Dashboard</mdc-drawer-item >
          <mdc-drawer-item start-icon="room_service" :to="{ name: 'services' }">Serviços</mdc-drawer-item >
          <mdc-drawer-item start-icon="bubble_chart" :to="{ name: 'serviceTypes' }">Tipos de serviços</mdc-drawer-item >
          <mdc-drawer-item start-icon="label" :to="{ name: 'attributes' }">Atributos</mdc-drawer-item >
          <mdc-drawer-item start-icon="class" :to="{ name: 'tags' }">Etiquetas</mdc-drawer-item >
          <mdc-drawer-item start-icon="people" :to="{ name: 'teams' }">Responsáveis</mdc-drawer-item >
        </mdc-drawer-list>
      </mdc-drawer>
      <main>
        <router-view></router-view>
      </main>
    </mdc-layout-app>
  </div>
</template>

<script>
import Vue from 'vue';
import VueMDCAdapter from 'vue-mdc-adapter';
import { mapState } from 'vuex';

Vue.use(VueMDCAdapter);

export default {
  name: 'App',
  components: {},
  computed: mapState(['page']),
};
</script>

<style lang="scss">
@import 'vue-mdc-adapter/dist/styles';

.mdc-layout-app--content-wrapper {
  background: #f2f2f2;
}
</style>
