import Vue from 'vue';
import App from './App';
import store from './store';

new Vue({
  el: '#app',
  store,
  render: h => h(App),
  created() {
    // console.log('created')
  },
  components: { App },
  template: '<App/>',
});
