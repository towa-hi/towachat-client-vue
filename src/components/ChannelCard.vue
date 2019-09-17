<template>
  <div class="channel-card" v-if="channel">
    update: {{this.update}}
    <ul>
      <li>id: {{channel._id}}</li>
      <li>name: {{channel.name}}</li>
      <li>owner: {{channel.owner}}
      <li>description: {{channel.description}}</li>
    </ul>
    members:
    <ul>
      <li v-for="memberId in channel.members">
        <user-preview :userId="memberId"/>
      </li>
    </ul>
    <!-- <div v-if="$store.state.authenticated">
      <button v-if="channel.members.indexOf($store.state.self) !== -1" type="button" v-on:click="$store.dispatch('leaveChannel', channel._id)">leave channel</button>
      <button v-else type="button" v-on:click="$store.dispatch('joinChannel', channel._id)">join channel</button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'channel-card',
  props: {
    channelId: {
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
      channel: {}
    }
  },
  created() {
    console.log('CHANNELCARD MADE')
    if (this.update) {
      console.log('GETTING UPDATE OBJ')
      this.$store.dispatch('getChannel', this.channelId).then((response) => {
        this.channel = response;
      });
    } else {
      console.log('GETTING EPHEMERAL OBJ');
      this.$store.dispatch('getEphemeralChannel', this.channelId).then((response) => {
        this.channel = response;
      })
    }
  }
}
</script>

<style>
.channel-card {
  border: 1px solid;
  background-color: #c79689;
}

</style>
