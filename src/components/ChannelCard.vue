<template>
  <div class="channel-card" v-if="channel">
    <ul>
      <li>id: {{channel._id}}</li>
      <li>name: {{channel.name}}</li>
      <li>description: {{channel.description}}</li>
    </ul>
    members:
    <ul>
      <li v-for="memberId in channel.members">
        {{memberId}}
      </li>
    </ul>
    <button v-if="channel.members.indexOf($store.state.self) !== -1" type="button" v-on:click="$store.dispatch('leaveChannel', channel._id)">leave channel</button>
    <button v-else type="button" v-on:click="$store.dispatch('joinChannel', channel._id)">join channel</button>
  </div>
</template>

<script>
export default {
  name: 'channel-card',
  props: {
    channelId: {
      required: true,
      type: String
    }
  },
  computed: {
    channel() {
      var channel = this.$store.state.channels[this.channelId];
      if (channel) {
        if (channel.alive) {
          return this.$store.state.channels[this.channelId];
        }
      }
      return false;
    }
  },
  created() {
    //FIX THIS LATER
    this.$store.dispatch('requestChannel', this.channelId);

    // this.$store.dispatch('requestChannel', this.channelId).then(() => {
    //   console.log(this.$store.state.channels[this.channelId].members)
    //   for (var memberId in this.$store.state.channels[this.channelId].members) {
    //     this.$store.dispatch('getUser', memberId);
    //   }
    // });
  }
}
</script>

<style>
.channel-card {
  border: 1px solid;
  background-color: #c79689;
}

</style>
