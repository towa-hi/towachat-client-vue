import Vue from 'vue'
import Vuex from 'vuex'
const store = require('./store');
const request = require('request');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    self: {},
    channels: [],
  },
  getters: {
    isLoggedIn(state) {
      if (state.self._id) {
        return true;
      } else {
        console.log('user not logged in')
        return false;
      }
    }
  },
  mutations: {
    setSelf(state, user) {
      if (user._id) {
        state.self = user;
        localStorage.setItem('token', 'Token ' + user.token);
        console.log('store.js setSelf(): Token saved to localStorage.');
      } else {
        state.self = {};
        localStorage.removeItem('token');
        console.log('store.js setSelf(): token wiped');
      }
    },
    setChannels(state, channels) {
      console.time('setChannels');
      state.channels = channels;
      console.log('store.js setChannels(): Channels saved.');
      console.timeEnd('setChannels');
    }
  },
  actions: {
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
    verify({commit, dispatch}) {
      console.log('store.js verify()');
      console.time('verify request');
      request(
        {
          method: 'GET',
          url: 'http://localhost:5000/api/users/self',
          json: true,
          headers: {
            'Authorization': localStorage.token,
          }
        },
        (err, httpResponse, body) => {
          console.timeEnd('verify request');
          if (body._id) {
            commit('setSelf', body);
          } else {
            dispatch('logout');
          }
        }
      );
    },
    register({commit, dispatch}, {username, password, passwordVerify}) {
      console.log('store.js register()');
      if (password === passwordVerify) {
        var registerReqJSON = {
          "username": username,
          "password": password
        };
        request(
          {
            method: 'POST',
            url: 'http://localhost:5000/api/users/register',
            json: registerReqJSON,
          },
          (err, httpResponse, body) => {
            if (body._id) {
              commit('setSelf', body);
            } else {
              commit('setSelf', {});
            }
          }
        );
      }
    },
    editSelf({commit, dispatch}, {avatar, handle}) {
      if (this.getters.isLoggedIn) {
        console.log('store.js editSelf()');
        var editReqJSON = {
          "avatar": avatar,
          "handle": handle,
        };
        request(
          {
            method: 'PATCH',
            url: 'http://localhost:5000/api/users/self',
            json: editReqJSON,
            headers: {
              'Authorization': localStorage.token,
            }
          },
          (err, httpResponse, body) => {
            if (body._id) {
              commit('setSelf', body);
            }
          }
        );
      }
    },
    getChannels({commit, dispatch}) {
      console.log('store.js getChannels()');
      console.time('getChannels request');
      request(
        {
          method: 'GET',
          url: 'http://localhost:5000/api/channels',
          json: true,
        },
        (err, httpResponse, body) => {
          console.timeEnd('getChannels request');
          commit('setChannels', body);

        }
      );
    },
    createChannel({commit, dispatch}, {name, description, isPublic}) {
      if (this.getters.isLoggedIn) {
        console.log('store.js createChannel()');
        var createChannelJSON = {
          "name": name,
          "description": description,
          "public": isPublic
        }
        request(
          {
            method: 'POST',
            url: 'http://localhost:5000/api/channels',
            json: createChannelJSON,
            headers: {
              'Authorization': localStorage.token,
            }
          },
          (err, httpResponse, body) => {
            dispatch('getChannels');
            dispatch('verify');
          }
        );
      }
    },
    editChannel({commit, dispatch}, {channelId, name, description, isPublic, avatar}) {
      if (this.getters.isLoggedIn) {
        console.log('store.js editChannel()');
        var editChannelJSON = {
          "name": name,
          "description": description,
          "avatar": avatar,
          "public": isPublic
        };
        request(
          {
            method: 'PATCH',
            url: 'http://localhost:5000/api/channels/' + channelId,
            json: editChannelJSON,
            headers: {
              'Authorization': localStorage.token,
            }
          },
          (err, httpResponse, body) => {
            console.log('DISPATCHING')
            dispatch('getChannels');
            dispatch('verify');
          }
        );
      }
    },
    deleteChannel({commit, dispatch}, channelId) {
      if (this.getters.isLoggedIn) {
        console.log('store.js deleteChannel()');
        request(
          {
            method: 'DELETE',
            url: 'http://localhost:5000/api/channels/' + channelId,
            headers: {
              'Authorization': localStorage.token,
            }
          },
          (err, httpResponse, body) => {
            dispatch('prune');
            dispatch('getChannels');
            dispatch('verify');
          }
        );
      }
    },
    joinChannel({commit, dispatch}, channelId) {
      if (this.getters.isLoggedIn) {
        console.log('store.js joinChannel()');
        request(
          {
            method: 'POST',
            url: 'http://localhost:5000/api/channels/' + channelId + '/membership',
            headers: {
              'Authorization': localStorage.token,
            }
          },
          (err, httpResponse, body) => {
            if (httpResponse.statusCode == 200) {
              dispatch('verify');
            } else {
              console.log(httpResponse.body);
            }
          }
        );
      }
    },
    leaveChannel({commit, dispatch}, channelId) {
      if (this.getters.isLoggedIn) {
        console.log('store.js leaveChannel()');
        request(
          {
            method: 'DELETE',
            url: 'http://localhost:5000/api/channels/' + channelId + '/membership',
            headers: {
              'Authorization': localStorage.token,
            }
          },
          (err, httpResponse, body) => {
            console.log('store.js leaveChannel() ' + httpResponse.body);
            console.log(httpResponse.statusCode);
            if (httpResponse.statusCode == 200) {
              dispatch('verify');
            } else {
              console.log(httpResponse.body);
            }
          }
        );
      }
    },
    prune({commit, dispatch}) {
      if (this.getters.isLoggedIn) {
        console.log('store.js prune()');
        request(
          {
            method: 'PATCH',
            url: 'http://localhost:5000/api/users/prune',
            headers: {
              'Authorization': localStorage.token,
            }
          },
          (err, httpResponse,body) => {
            dispatch('verify');
          }
        );
      }
    }

  }
})
