<template>
  <div class="chat" v-if="!loading">
    <div class="devbar">
      devbar
      <button type="button" v-on:click="getMessages(0)">get messages</button>
      <button type="button" v-on:click="getMessages(10)">get messages +10 </button>
      <button type="button" v-on:click="getMessages(-10)">get messages -10</button>
    </div>
    <div class="top-panel" v-bind:title="channel._id">
      <span id="channel-name">{{channel.name}}</span> ({{channel._id}})
    </div>
    <div class="bot-panel">

      <div class="left-panel">
        <div v-for="memberId in channel.members" :key="memberId">
          <chat-userlist-user :userId="memberId" :update="true"/>
        </div>
      </div>
      <div class="chatbox">
        <div class="messagebox">
            <message v-for="messageId in messages" :key="$store.state.messages[messageId]._id" :messageId="messageId"/>
        </div>
        <div class="chat-input">
          <textarea class="chat-input-text" placeholder="Type a message" v-model="chatInput" v-on:keyup="triggerMessageSend"/>
          <button class="chat-input-send" v-on:click="sendMessage()">Send</button>
        </div>
      </div>
    </div>
    <!-- <button type="button" v-on:click="fakeMessage()">fake message</button> -->
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
      chatInput: ''
    }
  },
  computed: {
    messages() {
      return this.$store.state.joinedChannels[this.channelId];
    },
    channel() {
      return this.$store.state.channels[this.channelId];
    }
  },
  created() {
    this.loading = false;
  },
  mounted() {
    this.getMessages(0)
  },
  methods: {
    timestampToTime(timestamp) {
      var time = new Date(timestamp);
      return time.toISOString();
    },
    triggerMessageSend(e) {
      console.log('triggerMessageSend')
      e.preventDefault();
      if (e.keyCode === 13 & !e.shiftKey) {
        this.sendMessage();
      }
    },
    sendMessage() {
      var newMessage = {
        channel: this.currentChannelId,
        messageText: this.chatInput,
        file: null
      };
      this.$store.dispatch('createMessage', newMessage);
      this.chatInput = '';
    },
    fakeMessage() {
      var now = new Date();
      var fakeMessageString = now.toISOString();
      var newMessage = {
        channel: this.currentChannelId,
        messageText: fakeMessageString,
        file: null
      };
      this.$store.dispatch('createMessage', newMessage);
    },
    getMessages(mode) {
      var messages = this.$store.state.joinedChannels[this.channelId]
      let req;
      if (mode <= 0) {
        req = {
          channelId: this.currentChannelId,
          mode: mode,
          from: messages[0]
        };
      } else {
        req = {
          channelId: this.currentChannelId,
          mode: mode,
          from: messages[messages.length - 1]
        }
      }
      this.$store.dispatch('getMessages', req);
    }
  }
}
</script>


<style>
/* pink */
.chat {
  background-color: #e0b2d0;
  display: flex;
  flex-direction: column;
}
/* purple */
.top-panel {
  background-color: #ae6eba;
  height: 2em;
}
/* gold */
.bot-panel{
  background-color: #777159;
  display: flex;

}
/* cyan */
.left-panel{
  background-color: #98d2e4;
}
/* green */
.chatbox {
  background-color: #c7d9cd;
  min-width: 0;
}
/* green */
.messagebox {
  background-color: #68be84;
  max-height: 400px;
  overflow-y: scroll;

}
.chat-input {
  display: flex;
}
.chat-input-text {
  flex-grow: 2;
}
#channel-name {
  font-weight: bold;
  line-height: 2em;
}

</style>
