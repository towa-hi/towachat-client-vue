import socket from './socket';
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import UserCard from './components/UserCard.vue';
import ChannelCard from './components/ChannelCard.vue';


Vue.component('user-card', UserCard);
Vue.component('channel-card', ChannelCard);
Vue.config.productionTip = false;



new Vue({
  store: store,
  render: h => h(App)
}).$mount('#app')
