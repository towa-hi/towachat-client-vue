<template>
  <div v-if="!loading">
    {{user.username}}
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
      if (this.update == true) {
        return this.$store.state.users[this.userId];
      } else {
        return this.ephemeralUser;
      }
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
