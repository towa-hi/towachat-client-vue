<template>
  <div class="channel-card">
    <ul>
      <li>id: {{channel._id}}</li>
      <li>name: {{channel.name}}</li>
      <li>description: {{channel.description}}</li>
    </ul>
    members:
    <ul>
      <li v-for="member in channel.members">

      </li>
    </ul>
    <button v-if="channel.members.indexOf($store.state.self._id) !== -1" type="button" v-on:click="$store.dispatch('leaveChannel', channel._id)">leave channel</button>
    <button v-else type="button" v-on:click="$store.dispatch('joinChannel', channel._id)">join channel</button>
  </div>
</template>

<script>
export default {
  name: 'channel-card',
  props: {
    channelId: String,
  },
  data: () => {
    return {
      channel: {}
    };
  },
  methods: {
    getMembers() {
      return $store.dispatch(channel.members);
    }
  },
  mounted() {

  }
}
</script>

<style>
.channel-card {
  border: 1px solid;
  background-color: #c79689;
}

</style>
