import Vue from 'vue'
import Vuex from 'vuex'
const request = require('request');
const config = require('../config/main');
// const socket = require('./socket');
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    self: null,
    users: {},
    channels: [],
    connected: false,
    authenticated: false,
    benis: false,
  },
  getters: {
    getSelf(state) {
      return state.users[state.self];
    }
  },
  mutations: {
    connected(state, isConnected) {
      state.connected = isConnected;
      console.log('store.js connected');
    },
    authenticated(state, isAuthenticated) {
      state.authenticated = isAuthenticated;
      console.log('store.js authenticated')
    },
    setSelf(state, userId) {
      state.self = userId;
      console.log('store.js setSelf');
    },

    setChannels(state, channels) {
      state.channels = channels;
      console.log('store.js setChannels(): channels saved');
    },
    addChannel(state, channel) {
      state.channels[channel._id] = channel;
      console.log('store.js addChannels(): channel added');
    },
    setUsers(state, users) {
      state.users = users;
      console.log('store.js setUsers(): users saved');
    },
    addUser(state, user) {
      state.users[user._id] = user;
      console.log('store.js addUser(): user added');
    }
  },
  actions: {
    SOCKET_wewlad({commit, dispatch}, data) {
      console.log(data);
    },
    SOCKET_connect({commit, dispatch}) {
      console.log('socket connected');
      commit('connected', true);
      this._vm.$socket.emit('authenticate', {token: localStorage.token});
    },
    SOCKET_newUser({commit, dispatch}, user) {
      console.log('socket newuser');
      commit('addUser', user);
    },
    SOCKET_newSelf({commit, dispatch}, selfId) {
      console.log('socket newSelf');
      commit('authenticated', true);
      commit('setSelf', selfId);
    },
    SOCKET_newToken({commit, dispatch}, token) {
      console.log('socket newToken');
      localStorage.setItem('token', token);
    },
    connected({commit, dispatch}, isConnected) {
      commit('connected', isConnected);
    },
    authenticated({commit, dispatch}, self) {
      commit('authenticated', true);
      //commit('setSelf')
    },
    setSelf({commit, dispatch}, selfId) {
      commit('setSelf', selfId)
    },
    getUser({commit, dispatch}, userId) {
      console.log('got skt_getuser');
      commit('addUser', userId);
      // socket.emit('getUser', userId);
      return state.users[userId];
    },
    getChannel({commit, dispatch}, channelId) {
      console.log('got skt_getchannel');
      commit('addChannel', channelId);
      // socket.emit('getChannel', channelId);
      return state.channels[channelId];
    },
    newToken(newToken) {
      console.log('received a new token from serber');
      localStorage.setItem('token', newToken);
    },
    // getChannelsById({commit, dispatch}, channelIdList) {
    //   var getChannelsJSON = {
    //     "channels": channelIdList
    //   }
    //   request(
    //     {
    //       method: 'GET',
    //       url: config.SERVER_URL + '/api/db/getChannelById',
    //       json: getChannelsJSON,
    //     },
    //     (err, httpResponse, body) => {
    //       commit('setChannels', body);
    //     }
    //   )
    // },
    //
    //
    login({commit, dispatch}, {username, password}) {
      dispatch('logout');
      console.log('store.js login()');
      var loginReqJSON = {
        "username": username,
        "password": password
      }
      request(
        {
          method: 'POST',
          url: 'http://localhost:5000/api/users/login',
          json: loginReqJSON,
        },
        (err, httpResponse, body) => {
          if (body._id) {
            console.log('id:', body._id);
            console.log('body found');
            commit('setSelf', body);
          } else {
            console.log('error');
            commit('setSelf', {});
          }
        }
      );
      dispatch('prune');
    },
    logout({commit, dispatch}) {
      console.log('store.js logout()');
      commit('setSelf', {});
      localStorage.removeItem('token');
      console.log('store.js logout() token wiped')
    },
    // verify({commit, dispatch}) {
    //   console.log('store.js verify()');
    //   console.time('verify request');
    //   request(
    //     {
    //       method: 'GET',
    //       url: 'http://localhost:5000/api/users/self',
    //       json: true,
    //       headers: {
    //         'Authorization': localStorage.token,
    //       }
    //     },
    //     (err, httpResponse, body) => {
    //       console.timeEnd('verify request');
    //       if (body._id) {
    //         commit('setSelf', body);
    //       } else {
    //         dispatch('logout');
    //       }
    //     }
    //   );
    // },
    // register({commit, dispatch}, {username, password, passwordVerify}) {
    //   console.log('store.js register()');
    //   if (password === passwordVerify) {
    //     var registerReqJSON = {
    //       "username": username,
    //       "password": password
    //     };
    //     request(
    //       {
    //         method: 'POST',
    //         url: 'http://localhost:5000/api/users/register',
    //         json: registerReqJSON,
    //       },
    //       (err, httpResponse, body) => {
    //         if (body._id) {
    //           commit('setSelf', body);
    //         } else {
    //           commit('setSelf', {});
    //         }
    //       }
    //     );
    //   }
    // },
    // editSelf({commit, dispatch}, {avatar, handle}) {
    //   if (this.getters.isLoggedIn) {
    //     console.log('store.js editSelf()');
    //     var editReqJSON = {
    //       "avatar": avatar,
    //       "handle": handle,
    //     };
    //     request(
    //       {
    //         method: 'PATCH',
    //         url: 'http://localhost:5000/api/users/self',
    //         json: editReqJSON,
    //         headers: {
    //           'Authorization': localStorage.token,
    //         }
    //       },
    //       (err, httpResponse, body) => {
    //         if (body._id) {
    //           commit('setSelf', body);
    //         }
    //       }
    //     );
    //   }
    // },
    // getChannels({commit, dispatch}) {
    //   console.log('store.js getChannels()');
    //   console.time('getChannels request');
    //   request(
    //     {
    //       method: 'GET',
    //       url: 'http://localhost:5000/api/channels',
    //       json: true,
    //     },
    //     (err, httpResponse, body) => {
    //       console.timeEnd('getChannels request');
    //       commit('setChannels', body);
    //     }
    //   );
    // },
    // createChannel({commit, dispatch}, {name, description, isPublic}) {
    //   if (this.getters.isLoggedIn) {
    //     console.log('store.js createChannel()');
    //     var createChannelJSON = {
    //       "name": name,
    //       "description": description,
    //       "public": isPublic
    //     }
    //     request(
    //       {
    //         method: 'POST',
    //         url: 'http://localhost:5000/api/channels',
    //         json: createChannelJSON,
    //         headers: {
    //           'Authorization': localStorage.token,
    //         }
    //       },
    //       (err, httpResponse, body) => {
    //         dispatch('getChannels');
    //         dispatch('verify');
    //       }
    //     );
    //   }
    // },
    // editChannel({commit, dispatch}, {channelId, name, description, isPublic, avatar}) {
    //   if (this.getters.isLoggedIn) {
    //     console.log('store.js editChannel()');
    //     var editChannelJSON = {
    //       "name": name,
    //       "description": description,
    //       "avatar": avatar,
    //       "public": isPublic
    //     };
    //     request(
    //       {
    //         method: 'PATCH',
    //         url: 'http://localhost:5000/api/channels/' + channelId,
    //         json: editChannelJSON,
    //         headers: {
    //           'Authorization': localStorage.token,
    //         }
    //       },
    //       (err, httpResponse, body) => {
    //         console.log('DISPATCHING')
    //         dispatch('getChannels');
    //         dispatch('verify');
    //       }
    //     );
    //   }
    // },
    // deleteChannel({commit, dispatch}, channelId) {
    //   if (this.getters.isLoggedIn) {
    //     console.log('store.js deleteChannel()');
    //     request(
    //       {
    //         method: 'DELETE',
    //         url: 'http://localhost:5000/api/channels/' + channelId,
    //         headers: {
    //           'Authorization': localStorage.token,
    //         }
    //       },
    //       (err, httpResponse, body) => {
    //         //dispatch('prune');
    //         dispatch('getChannels');
    //         dispatch('verify');
    //       }
    //     );
    //   }
    // },
    // joinChannel({commit, dispatch}, channelId) {
    //   if (this.getters.isLoggedIn) {
    //     console.log('store.js joinChannel()');
    //     request(
    //       {
    //         method: 'POST',
    //         url: 'http://localhost:5000/api/channels/' + channelId + '/membership',
    //         headers: {
    //           'Authorization': localStorage.token,
    //         }
    //       },
    //       (err, httpResponse, body) => {
    //         if (httpResponse.statusCode == 200) {
    //           dispatch('verify');
    //         } else {
    //           console.log(httpResponse.body);
    //         }
    //       }
    //     );
    //   }
    // },
    // leaveChannel({commit, dispatch}, channelId) {
    //   if (this.getters.isLoggedIn) {
    //     console.log('store.js leaveChannel()');
    //     request(
    //       {
    //         method: 'DELETE',
    //         url: 'http://localhost:5000/api/channels/' + channelId + '/membership',
    //         headers: {
    //           'Authorization': localStorage.token,
    //         }
    //       },
    //       (err, httpResponse, body) => {
    //         console.log('store.js leaveChannel() ' + httpResponse.body);
    //         console.log(httpResponse.statusCode);
    //         if (httpResponse.statusCode == 200) {
    //           dispatch('verify');
    //         } else {
    //           console.log(httpResponse.body);
    //         }
    //       }
    //     );
    //   }
    // },
    // prune({commit, dispatch}) {
    //   if (this.getters.isLoggedIn) {
    //     console.log('store.js prune()');
    //     request(
    //       {
    //         method: 'PATCH',
    //         url: 'http://localhost:5000/api/users/prune',
    //         headers: {
    //           'Authorization': localStorage.token,
    //         }
    //       },
    //       (err, httpResponse,body) => {
    //         dispatch('verify');
    //       }
    //     );
    //   }
    // }

  }
})
