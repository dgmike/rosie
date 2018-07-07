import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: {
      name: 'anonymous',
      email: '',
    },
    page: {
      title: ''
    },
  },
  mutations: {
  },
});

export default store;
