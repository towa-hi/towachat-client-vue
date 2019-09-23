<template>
  <div class="chat" v-if="!loading">
    channel component
    <div class="chatbox">
      <div v-for="index in messages">
        <user :userId="$store.state.messages[index].user"/>
        {{$store.state.messages[index].time}} - {{$store.state.messages[index].messageText}}
      </div>
    </div>
    <button type="button" v-on:click="fakeMessage()">fake message</button>

  </div>
</template>

<script>
export default {
  name: 'chat',
  props: {
    channelId: {
      required: true,
      type: String
    }
  },
  data: function () {
    return {
      loading: true,
      currentChannelId: this.channelId,
    }
  },
  computed: {
    messages() {
      return this.$store.state.joinedChannels[this.channelId];
    }
  },
  created() {
    this.loading = false;
  },
  methods: {
    fakeMessage() {
      console.log('doing fake message');
      var newMessage = {
        channel: this.currentChannelId,
        messageText: 'haha benis',
        file: null
      }
      this.$store.dispatch('createMessage', newMessage)
    }
  }
}
</script>


<style>

</style>
