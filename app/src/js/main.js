import Vue from 'vue';
import App from './App'

new Vue({
  el: '#app',
  render: h => h(App),
  created: function () {
    console.log('bla')
  },
  components: { App },
  template: '<App/>',
});
