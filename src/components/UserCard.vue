<template>
  <div class="user-card" v-if="$store.state.users[this.userId]">
    User Info
    <ul>
      <li>id: {{user._id}}</li>
      <li>username: {{user.username}}</li>
      <li>handle: {{user.handle}}</li>
      <li>avatar: {{user.avatar}}</li>
      <ul id="user-card-channel-list">
        <li v-for="channelId in user.channels">
          <channel-card :channelId="channelId"/>
        </li>
      </ul>
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

      return this.$store.state.users[this.userId];
    }
  },
  created() {
    this.$store.dispatch('requestUser', this.userId);
  }
}
</script>

<style>
.user-card {
  border: 1px solid;
  background-color: #42b983;
}

</style>
