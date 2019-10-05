<template>
  <div class="chat" v-if="!loading">
    <div class="devbar">
      devbar
      <button type="button" v-on:click="getMessages(0)">get messages</button>
      <button type="button" v-on:click="getMessages(10)">get messages +10 </button>
      <button type="button" v-on:click="getMessages(-10)">get messages -10</button>
    </div>
    <div class="top-panel" v-bind:title="channel._id">
      <div class="top-panel-top-row">
        <span id="channel-name">{{channel.name}}</span> ({{channel._id}})
      </div>
      <div class="top-panel-bot-row">
        <span id="channel-description">{{channel.description}}</span>
      </div>
    </div>
    <div class="bot-panel">

      <div class="left-panel">
        <chat-userlist :channelId="channelId"/>
      </div>
      <div class="chatbox">
        <div class="messagebox" v-chat-scroll="{always: false, smooth: true}">
            <message v-for="messageId in messages" :key="$store.state.messages[messageId]._id" :messageId="messageId" :big="messageBig(messageId)"/>
            <span id="chat-bottom"></span>
        </div>
        <div class="chat-input">
          <textarea-autosize :max-height="350" class="chat-input-text" placeholder="Type a message" v-model="chatInput" v-on:keyup.enter="sendMessage()"/>
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
  mounted() {
    if (this.$store.state.joinedChannels[this.channelId]) {
      this.loading = false;
    }
    this.getMessages(0)
  },
  methods: {
    messageBig(messageId) {
      var messages = this.$store.state.joinedChannels[this.channelId];
      var index = messages.indexOf(messageId);
      if (index !== -1) {
        if (index > 0) {
          var prevMessageId = messages[index - 1];
          var prevMessage = this.$store.state.messages[prevMessageId];
          var message = this.$store.state.messages[messageId];
          if (prevMessage.user == message.user) {
            if (message.time - prevMessage.time < 300000) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    },
    timestampToTime(timestamp) {
      var time = new Date(timestamp);
      return time.toISOString();
    },
    triggerMessageSend() {
      // i broke this by using textarea-autoresize. solution here probably https://github.com/devstark-com/vue-textarea-autosize/issues/12
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
  padding: 3px;
}
/* gold */
.bot-panel{
  background-color: #777159;
  display: flex;

}
/* cyan */
.left-panel{
  background-color: #98d2e4;
  flex-basis: 150px;
}
/* green */
.chatbox {
  background-color: #c7d9cd;
  min-width: 0;
  flex-grow: 2;
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
  resize: none;
}
#channel-name {
  font-weight: bold;
  line-height: 2em;
}

</style>
