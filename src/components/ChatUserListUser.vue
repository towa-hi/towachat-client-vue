<template>
  <div class="chat-userlist-user" v-if="!loading">
    <avatar :userId="userId" :update="update" :src="ephemeralUser.avatar" :big="true"/>
    <span class="chat-userlist-user-username">{{user.username}}</span>
  </div>
</template>

<script>

export default {
  name: 'chat-userlist-user',
  props: {
    userId: {
      require: true,
      type: String
    },
    update: {
      type: Boolean
    }
  },
  data: function () {
    return {
      ephemeralUser: {},
      loading: true
    }
  },
  computed: {
    user() {
      if (this.$store.state.users[this.userId]) {
        return this.$store.state.users[this.userId];
      } else {
        return this.ephemeralUser;
      }
      // if (this.update == true) {
      //   return this.$store.state.users[this.userId];
      // } else {
      //   return this.ephemeralUser;
      // }
    }
  },
  mounted() {
    if (this.update) {
      this.$store.dispatch('getUser', this.userId).then((response) => {
        this.loading = false;
      });
    } else {
      this.$store.dispatch('getEphemeralUser', this.userId).then((response) => {
        this.ephemeralUser = response;
        this.loading = false;
      });
    }
  }
}
</script>

<style>
.chat-userlist-user {
  display: flex;
  height: 2em;
  margin: 2px;
  border: 1px solid black;
}
.chat-userlist-user-username {
  font-weight: bold;
  line-height: 2em;
  padding-left: 3px;
}
</style>
