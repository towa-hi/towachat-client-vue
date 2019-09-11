<template>
  <div class="user-card">
    User Info
    <ul>
      <li>id: {{user._id}}</li>
      <li>username: {{user.username}}</li>
      <li>handle: {{user.handle}}</li>
      <li>avatar: {{user.avatar}}</li>
    </ul>


  </div>
</template>

<script>
export default {
  name: 'user-card',
  props: {
    userId: {
      required: true,
      type: String
    }
  },
  computed: {
    user() {
      return this.$store.state.users[this.userId]
      // return this.$store.dispatch('getUser', this.userId);
    }
  }
}
</script>

<style>
.user-card {
  border: 1px solid;
  background-color: #42b983;
}

</style>
