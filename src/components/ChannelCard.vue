<template>
  <div class="channel-card" v-if="!loading">
    <ul>
      <li>id: {{channel._id}}</li>
      <li>name: {{channel.name}}</li>
      <li>owner: {{channel.owner}}</li>
      <li>description: {{channel.description}}</li>
    </ul>
    members:
    <ul>
      <li v-for="memberId in channel.members">
        <user :userId="memberId"/>
      </li>
    </ul>
    <div v-if="channel.owner !== $store.state.self">
      <button v-if="channel.members.indexOf($store.state.self) !== -1" type="button" v-on:click="$store.dispatch('leaveChannel', channel._id)">leave channel</button>
      <button v-else type="button" v-on:click="joinChannel()">join channel</button>
    </div>

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
      ephemeralChannel: {},
      loading: true
    }
  },
  computed: {
    channel() {
      if (this.update == true) {
        return this.$store.state.channels[this.channelId];
      } else {
        return this.ephemeralChannel;
      }
    }
  },
  mounted() {
    if (this.update) {
      this.$store.dispatch('getChannel', this.channelId).then((response) => {
        this.loading = false;
      });
    } else {
      this.$store.dispatch('getEphemeralChannel', this.channelId).then((response) => {
        this.ephemeralChannel = response;
        this.loading = false;
      });
    }
  },
  methods: {
    joinChannel() {
      this.$store.dispatch('joinChannel', this.channelId).then(() => {
        this.$store.dispatch('getEphemeralChannel', this.channelId).then((response) => {
          this.ephemeralChannel = response;
        });
      });
    },

  }
}
</script>

<style>
.channel-card {
  border: 1px solid;
  background-color: #c79689;
}

</style>
