
  const Validator = require('validator');
  const config = require('../config/main');

  export default {
    name: 'app',
    data: () => {
      return {
        loginInput: {
          username: '',
          password: '',
        },
        registerInput: {
          username: '',
          password: '',
          passwordVerify: ''
        },
        editSelfInput: {
          avatar: '',
          handle: ''
        },
        createChannelInput: {
          name: '',
          description: '',
          isPublic: true
        },
        editChannelInput: {
          channelId: '',
          name: '',
          description: '',
          isPublic: true,
          avatar: '',
        },
        deleteChannelInput: {
          channelId: '',
        }
      }
    },
    computed: {
      self() {
        return this.$store.getters.getSelf;
      },
      connected() {
        return this.$store.state.connected;
      },
      authenticated() {
        return this.$store.state.authenticated;
      },
      localStorageToken() {
        return localStorage.token;
      },
      channelList() {
        return this.$store.state.channels;
      }
    },
    methods: {
      validateUsername(username) {
        console.log('App.js validateUsername()');
        if (Validator.isAlphanumeric(username)) {
          if (Validator.isLength(username, config.MIN_USERNAME_LENGTH, config.MAX_USERNAME_LENGTH)) {
            return true;
          }
          console.log('App.js validateUsername() must be between ' + config.MIN_USERNAME_LENGTH + ' and ' + config.MAX_USERNAME_LENGTH + ' long.');
        }
        console.log('App.js validateUsername() must be only alphanumeric');
        return false;
      },
      validatePassword(password) {
        console.log('App.js validatePassword()');
        if (Validator.isLength(password, config.MIN_PASSWORD_LENGTH, config.MAX_PASSWORD_LENGTH)) {
          return true;
        }
        console.log('App.js validatePassword() must be between ' + config.MIN_PASSWORD_LENGTH + ' and ' + config.MAX_PASSWORD_LENGTH + ' long.')
        return false;
      },
      validateAvatar(avatar) {
        if (Validator.isURL(avatar)) {
          return true;
        }
        console.log('App.js validateAvatar() must be a valid URL');
        return false;
      },
      validateHandle(handle) {
        if (Validator.isLength(handle, config.MIN_HANDLE_LENGTH, config.MAX_HANDLE_LENGTH)) {
          return true;
        }
        console.log('App.js validateHandle() must be between ' + config.MIN_HANDLE_LENGTH + ' and ' + config.MAX_HANDLE_LENGTH + ' long.')
        return false;
      },
      validateChannelName(channelName) {
        if (Validator.isLength(channelName, config.MIN_CHANNEL_NAME_LENGTH, config.MAX_CHANNEL_NAME_LENGTH)) {
          if (Validator.isAlphanumeric(channelName)) {
            return true;
          }
        }
        console.log('App.js validateChannelName failed');
        return false;
      },
      validateChannelDescription(channelDescription) {
        if (Validator.isLength(channelDescription, config.MIN_CHANNEL_DESCRIPTION_LENGTH, config.MAX_CHANNEL_DESCRIPTION_LENGTH)) {
          return true;
        }
        console.log('App.js validateChannelDescription failed');
        return false;
      },
      validateChannelAvatar(avatar) {
        if (Validator.isURL(avatar)) {
          return true;
        }
        return false;
      },
      login(username, password) {
        if (this.validateUsername(username) && this.validatePassword(password)) {
          this.$store.dispatch('login', {username, password});
        }
      },
      logout() {
        this.$store.dispatch('logout');
      },
      register(username, password, passwordVerify) {
        if (this.validateUsername(username) && this.validatePassword(password)) {
          this.$store.dispatch('register', {username, password, passwordVerify});
        }
      },
      editSelf(avatar, handle) {
        var edited = false;
        var newUserInfo = {avatar: '', handle: ''};
        if (this.validateHandle(handle)) {
          newUserInfo.handle = handle;
          edited = true;
        }
        if (this.validateAvatar(avatar)) {
          newUserInfo.avatar = avatar;
          edited = true;
        }
        if (edited == true) {
          this.$store.dispatch('editSelf', newUserInfo);
        }
      },
      getChannels() {
        this.$store.dispatch('getChannels');
      },
      createChannel(name, description, isPublic) {
        if (this.validateChannelName(name)) {
          if (this.validateChannelDescription(description)) {
            var createChannelArgs = {name: name, description: description, isPublic: true}
            this.$store.dispatch('createChannel', createChannelArgs);
          }
        }
      },
      editChannel(channelId, avatar, description, name) {
        var edited = false;
        var newChannelInfo = {channelId: channelId, avatar: '', description: '', name: ''};
        if (this.validateAvatar(avatar)) {
          newChannelInfo.avatar = avatar;
          edited = true;
        }
        if (this.validateChannelDescription(description)) {
          newChannelInfo.description = description;
          edited = true;
        }
        if (this.validateChannelName(name)) {
          newChannelInfo.name = name;
          edited = true;
        }
        if (edited == true) {
          console.log('dispatching');
          this.$store.dispatch('editChannel', newChannelInfo)
        } else {
          console.log('must edit');
        }
      },
      deleteChannel(channelId) {
        this.$store.dispatch('deleteChannel', channelId);
      },
      joinChannel(channelId) {
        this.$store.dispatch('joinChannel', channelId);
      },
      leaveChannel(channelId) {
        this.$store.dispatch('leaveChannel', channelId);
      },
      prune() {
        this.$store.dispatch('prune');
      }
    },
    created() {
      console.log('App.js.created()');
      
      // if (localStorage.token) {
      //   console.log('App.js.mounted(): token detected:', localStorage.token);
      //   this.$store.dispatch('verify', localStorage.token);
      // } else {
      //   console.log('App.js.mounted(): No token in localStorage.')
      // }
      // this.getChannels();
    },
  }
