<template>
  <div class="user-preview" v-if="!loading">
    <avatar :userId="userId" :update="update" :src="ephemeralUser.avatar"/>
    <span class="user-preview-username">{{user.username}}</span>
  </div>
</template>

<script>

export default {
  name: 'user',
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
  created() {
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
.user-preview {
  display: inline-block;
  height: 1em;
}
.user-preview-username {
  font-weight: bold;
  line-height: 1em;
  padding-left: 3px;
}
</style>
