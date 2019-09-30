<template>
  <div class="message">
    <div class="message-info">

      <avatar :userId="user._id" :update="true"/>
      <span class="message-username">{{user.username}}</span>:
      <span class="message-time">{{timestampToTime(message.time)}}</span>
    </div>
    <div class="message-text">{{message.messageText}}</div>
  </div>
</template>

<script>
export default {
  name: 'message',
  props: {
    messageId: {
      required: true,
      type: String
    }
  },
  data: function () {
    return {
      loading: true
    }
  },
  computed: {
    message() {
      return this.$store.state.messages[this.messageId];
    },
    user() {
      return this.$store.state.users[this.message.user]
    }
  },
  created() {
    //stuff

  },
  methods: {
    timestampToTime(timestamp) {
      var a = new Date(timestamp);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
      return time;
    }
  }
}

</script>


<style>
/* red */
.message {
  display: flex;
  flex-direction: column;
  background-color: #ec7f7f;
  margin: 4px;
}
.message-text {
  overflow-wrap: break-word;
}
.message-info {
  height: 1em;
  padding-bottom: 3px;
}
.message-username {
  font-weight: bold;
  line-height: 1em;
}
.message-time {
  font-weight: lighter;
  line-height: 1em;
}
</style>
