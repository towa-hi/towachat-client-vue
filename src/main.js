import socket from './socket';
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import UserCard from './components/UserCard.vue';
import UserPreview from './components/UserPreview.vue'
import ChannelCard from './components/ChannelCard.vue';
import Chat from './components/Chat.vue'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: true,
  connection: socket,
  vuex: {
    store,
    actionPrefix: 'SOCKET_'
  }
}));
Vue.component('user', UserPreview)
Vue.component('user-card', UserCard);
Vue.component('channel-card', ChannelCard);
Vue.component('chat', Chat);
Vue.config.productionTip = false;

new Vue({
  store: store,
  sockets: {
    // connect: function () {
    //   console.log('socket connected');
    // },
  },
  render: h => h(App)
}).$mount('#app')
