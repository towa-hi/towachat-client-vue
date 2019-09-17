<template>
  <div class="user-card">
    User Info
    <ul>
      <li>id: {{user._id}}</li>
      <li>username: {{user.username}}</li>
      <li>handle: {{user.handle}}</li>
      <li>avatar: {{user.avatar}}</li>
      <ul id="user-card-channel-list">
        <li v-for="channelId in user.channels">
          <channel-card :channelId="channelId" :update="true"/>
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
    },
    update: {
      required: true,
      type: Boolean
    }
  },
  data: function () {
    return {
      user: {},
    }
  },
  created() {
    if (this.update) {
      this.$store.dispatch('getUser', this.userId).then((response) => {
        this.user = response;
      });
    } else {
      this.$store.dispatch('getEphemeralUser', this.userId).then((response) => {
        this.user = response;
      });
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
