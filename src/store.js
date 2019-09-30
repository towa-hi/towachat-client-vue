import Vue from 'vue'
import Vuex from 'vuex'
const request = require('request');
const config = require('../config/main');
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    self: null,
    users: {},
    channels: {},
    messages: {},
    joinedChannels: {},
    connected: false,
    authenticated: false,
    view: 'mainView',
  },
  getters: {
    getSelf(state) {
      return state.users[state.self];
    },
    getChannel(state, channelId) {
      return state.channels[channelId];
    },

  },
  mutations: {
    connected(state, isConnected) {
      state.connected = isConnected;
      console.log('mutation connected');
    },
    authenticated(state, isAuthenticated) {
      state.authenticated = isAuthenticated;
      console.log('mutation authenticated')
    },
    setSelf(state, userId) {
      state.self = userId;
      if (state.self) {
        for (var index in state.users[state.self].channels) {
          var channelId = state.users[state.self].channels[index];
          Vue.set(state.joinedChannels, channelId, []);
        }
      }
      console.log('mutation setSelf');
    },
    setChannels(state, channels) {
      state.channels = channels;
      console.log('mutation setChannels');
    },
    addChannel(state, channel) {
      Vue.set(state.channels, channel._id, channel);
      // state.channels[channel._id] = channel;
      console.log('mutation addChannel');
    },
    setUsers(state, users) {
      state.users = users;
      console.log('mutation setUsers');
    },
    addUser(state, user) {
      Vue.set(state.users, user._id, user);
      // state.users[user._id] = user;
      console.log('mutation addUser');
    },
    addMessage(state, message) {
      Vue.set(state.messages, message._id, message);
      state.joinedChannels[message.channel].push(message._id);
      console.log('mutation addMessage');
    },
    setMessages(state, messages) {
      var messageIdArray  = []
      for (var index in messages) {
        Vue.set(state.messages, messages[index]._id, messages[index]);
        messageIdArray.push(messages[index]._id);
      }
      state.joinedChannels[messages[0].channel] = messageIdArray;
      console.log('mutation setMessages');
    },
    addMessagesBack(state, payload) {
      var messages = payload.messages;
      var from = payload.from;
      var messageIdArray = []
      for (var index in messages) {
        Vue.set(state.messages, messages[index]._id, messages[index]);
        messageIdArray.push(messages[index]._id);
      }
      //combine arrays
      var a1 = state.joinedChannels[messages[0].channel];
      var fromIndex = a1.indexOf(from);
      a1.splice(fromIndex, 0, ...messageIdArray)
      console.log('mutation addMessagesBack');

    },
    changeView(state, view) {
      state.view = view;
      console.log('mutation changeView');
    }
  },
  actions: {

    SOCKET_wewlad({commit, dispatch}) {
      console.log('WEW LAD!');
    },

    SOCKET_connect({commit, dispatch}) {
      console.log('action SOCKET_connect')
      commit('connected', true);
      if (localStorage.token) {
        console.log('socket.emit authenticate')
        this._vm.$socket.emit('authenticate', {token: localStorage.token});
      }
    },

    SOCKET_addUser({commit, dispatch}, user) {
      console.log('action SOCKET_addUser');
      commit('addUser', user);
    },

    SOCKET_addChannel({commit, dispatch}, channel) {
      console.log('action SOCKET_addChannel');
      commit('addChannel', channel);
    },

    SOCKET_addSelf({commit, dispatch, state}, selfId) {
      console.log('action SOCKET_addSelf');
      commit('authenticated', true);
      commit('setSelf', selfId);
      for (var index in state.users[selfId].channels) {
        dispatch('getChannel', state.users[selfId].channels[index]);
      }
    },

    SOCKET_newToken({commit, dispatch}, token) {
      console.log('action SOCKET_newToken');
      localStorage.setItem('token', token);
    },

    SOCKET_unauthorized({commit, dispatch}, msg) {
      console.log('action SOCKET_unauthorized' + msg);
      dispatch('logout');
    },

    SOCKET_newMessage({commit, dispatch}, message) {
      console.log('action SOCKET_newMessage');
      console.log(message);
      commit('addMessage', message);
    },
    login({commit, dispatch}, {username, password}) {
      console.log('action login')
      console.log('socket.emit login');
      this._vm.$socket.emit('login', {username: username, password: password}, (response) => {
        console.log('socket.emit login ack');
        commit('authenticated', true);
        commit('addUser', response.user);
        commit('setSelf', response.user._id);
        dispatch('SOCKET_newToken', response.token);
      });
    },

    register({commit, dispatch}, {username, password, passwordVerify}) {
      console.log('action register');
      if (password === passwordVerify) {
        var credentials = {
          username: username,
          password: password
        };
        this._vm.$socket.emit('register', credentials, (response) => {
          console.log('socket.emit register ack');
          commit('authenticated', true);
          commit('addUser', response.user);
          commit('setSelf', response.user._id);
          dispatch('SOCKET_newToken', response.token);
        });
      }
    },

    logout({commit, dispatch}) {
      console.log('action logout');
      commit('authenticated', false);
      commit('setSelf', null);
      localStorage.removeItem('token');
      // probably code here to unsub from everything
    },

    subUser({commit, dispatch}, userId) {
      console.log('action subUser');
      console.log('socket.emit getUser');
      this._vm.$socket.emit('getUser', userId, (response) => {
        commit('addUser', response);
      });
    },

    getUser({commit, dispatch, state}, userId) {
      console.log('action getUser');
      return new Promise((resolve, reject) => {
        console.log('socket.emit getUser');
        this._vm.$socket.emit('getUser', userId, (response) => {
          commit('addUser', response);
          resolve(state.users[userId]);
        });
      })
    },

    getEphemeralUser({commit, dispatch, state}, userId) {
      // console.log('action getEphemeralUser')
      return new Promise((resolve, reject) => {
        // if client is already subbed to a user (if user obj in store)
        if (state.users[userId]) {
          // console.log('getEphemeralUser served from state')
          resolve(state.users[userId]);
        } else {
          // console.log('socket.emit getEphemeralUser');
          this._vm.$socket.emit('getEphemeralUser', userId, (response) => {
            // console.log('getEphemeralUser callback');
            resolve(response);
          });
        }
      });
    },

    subChannel({commit, dispatch}, channelId) {
      console.log('action subChannel');
      console.log('socket.emit getChannel');
      this._vm.$socket.emit('getChannel', channelId, (response) => {
        commit('addChannel', response);
      });
    },

    getChannel({commit, dispatch, state}, channelId) {
      console.log('action getChannel');
      return new Promise((resolve, reject) => {
        console.log('socket.emit getChannel');
        this._vm.$socket.emit('getChannel', channelId, (response) => {
          commit('addChannel', response);
          resolve(state.channels[channelId]);
        });
      });
    },

    getEphemeralChannel({commit, dispatch, state}, channelId) {
      console.log('action getEphemeralChannel');
      return new Promise((resolve, reject) => {
        if (state.channels[channelId]) {
          console.log('getEphemeralChannel served from state');
          resolve(state.channels[channelId]);
        } else {
          console.log('socket.emit getEphemeralChannel');
          this._vm.$socket.emit('getEphemeralChannel', channelId, (response) => {
            console.log('getEphemeralChannel callback');
            resolve(response);
          });
        }
      });
    },

    editSelf({commit, dispatch}, {avatar, handle}) {
      console.log('action editSelf');
      console.log('socket.emit editSelf');
      this._vm.$socket.emit('editSelf', {avatar: avatar, handle: handle}, (response) => {
        console.log('socket.emit editSelf ack');
        commit('addUser', response);
      });
    },

    editChannel({commit, dispatch}, {channelId, avatar, description, name}) {
      console.log('action editChannel');
      console.log('socket.emit editChannel');
      this._vm.$socket.emit('editChannel', {channelId: channelId, avatar: avatar, description: description, name: name});
    },

    createChannel({commit, dispatch}, {name, description, isPublic}) {
      console.log('action createChannel');
      console.log('socket.emit createChannel');
      this._vm.$socket.emit('createChannel', {name: name, description: description, isPublic: isPublic});
    },

    deleteChannel({commit, dispatch}, channelId) {
      console.log('action deleteChannel');
      console.log('socket.emit deleteChannel');
      this._vm.$socket.emit('deleteChannel', channelId, (response) => {
        console.log('socket.emit deleteChannel ack: ' + response);
      });
    },

    requestAllChannels({commit, dispatch}) {
      console.log('action requestAllChannels');
      //MAKE THIS A PROMISE LATER
      this._vm.$socket.emit('getAllChannels', (response) => {
        for (var index in response) {
          commit('addChannel', response[index]);
        }
      });
    },

    joinChannel({commit, dispatch}, channelId) {
      console.log('action joinChannel');
      console.log('socket.emit joinChannel');
      this._vm.$socket.emit('joinChannel', channelId, (response) => {
        dispatch('subChannel', channelId);
        console.log('socket emit joinChannel ack: ' + response);
      });
    },

    leaveChannel({commit, dispatch}, channelId) {
      console.log('action leaveChannel');
      console.log('socket.emit leaveChannel');
      this._vm.$socket.emit('leaveChannel', channelId, (response) => {
        console.log('socket emit leaveChannel ack: ' + response);
      });
    },

    changeView({commit, dispatch}, viewName) {

      if (viewName === 'channelListView') {
        dispatch('requestAllChannels');
      }
      commit('changeView', viewName);
    },

    createMessage({commit, dispatch}, message) {
      console.log('action createMessage');
      this._vm.$socket.emit('createMessage', message, (response) => {
        console.log(response);
      });
    },

    getMessages({commit, dispatch}, {channelId, mode, from}) {
      console.log('action getMessages');
      this._vm.$socket.emit('getMessages', {channelId, mode, from}, (response) => {
        console.log('socket emit getMessages ack: ');
        if (response.length > 0) {
          if (mode == 0) {
            commit('setMessages', response);
          } else if (mode < 0){
            var payload = {messages: response,from: from}
            console.log(payload);
            commit('addMessagesBack', payload);
          }
        }
        else {
          console.log('action getMessages nothing left to get');
        }
      });
    }

    //
    // connected({commit, dispatch}, isConnected) {
    //   commit('connected', isConnected);
    // },
    // authenticated({commit, dispatch}, self) {
    //   commit('authenticated', true);
    //   //commit('setSelf')
    // },
    // setSelf({commit, dispatch}, selfId) {
    //   commit('setSelf', selfId)
    // },
    // getUser({commit, dispatch}, userId) {
    //   console.log('got skt_getuser');
    //   commit('addUser', userId);
    //   // socket.emit('getUser', userId);
    //   return state.users[userId];
    // },
    // getChannel({commit, dispatch}, channelId) {
    //   console.log('got skt_getchannel');
    //   commit('addChannel', channelId);
    //   // socket.emit('getChannel', channelId);
    //   return state.channels[channelId];
    // },
    // newToken(newToken) {
    //   console.log('received a new token from serber');
    //   localStorage.setItem('token', newToken);
    // },
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
    // login({commit, dispatch}, {username, password}) {
    //   dispatch('logout');
    //   console.log('store.js login()');
    //   var loginReqJSON = {
    //     "username": username,
    //     "password": password
    //   }
    //   request(
    //     {
    //       method: 'POST',
    //       url: 'http://localhost:5000/api/users/login',
    //       json: loginReqJSON,
    //     },
    //     (err, httpResponse, body) => {
    //       if (body._id) {
    //         console.log('id:', body._id);
    //         console.log('body found');
    //         commit('setSelf', body);
    //       } else {
    //         console.log('error');
    //         commit('setSelf', {});
    //       }
    //     }
    //   );
    //   dispatch('prune');
    // },
    // logout({commit, dispatch}) {
    //   console.log('store.js logout()');
    //   commit('setSelf', {});
    //   localStorage.removeItem('token');
    //   console.log('store.js logout() token wiped')
    // },
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
