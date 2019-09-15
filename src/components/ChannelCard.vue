<template>
  <div class="channel-card" v-if="$store.state.channels[this.channelId]">
    <ul>
      <li>id: {{channel._id}}</li>
      <li>name: {{channel.name}}</li>
      <li>description: {{channel.description}}</li>
    </ul>
    members:
    <ul>
      <li v-for="member in channel.members">
        {{$store.state.users[member].username}}
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
      //this returns unresolved cuz it hasnt requested the channelid first
      //gotta figure out how to fix this part
      return this.$store.state.channels[this.channelId];
    }
  },
  created() {
    this.$store.dispatch('requestChannel', this.channelId);
  }
}
</script>

<style>
.channel-card {
  border: 1px solid;
  background-color: #c79689;
}

</style>
