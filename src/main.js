import socket from './socket';
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import VueChatScroll from 'vue-chat-scroll';
import VueTextareaAutosize from 'vue-textarea-autosize';
import UserCard from './components/UserCard.vue';
import UserPreview from './components/UserPreview.vue'
import ChannelCard from './components/ChannelCard.vue';
import Chat from './components/Chat.vue';
import VueSocketIO from 'vue-socket.io';
import Message from './components/Message.vue';
import Avatar from './components/Avatar.vue';
import UserList from './components/UserList.vue'
import ChatUserListUser from './components/ChatUserListUser.vue';
Vue.use(VueChatScroll);
Vue.use(VueTextareaAutosize);
Vue.use(new VueSocketIO({
  debug: true,
  connection: socket,
  vuex: {
    store,
    actionPrefix: 'SOCKET_'
  }
}));
Vue.component('user', UserPreview);
Vue.component('user-card', UserCard);
Vue.component('channel-card', ChannelCard);
Vue.component('chat', Chat);
Vue.component('message', Message);
Vue.component('avatar', Avatar);
Vue.component('chat-userlist', UserList);
Vue.component('chat-userlist-user', ChatUserListUser);
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
