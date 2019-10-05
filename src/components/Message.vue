<template>
  <div class="message" v-if="!loading">
    <template v-if="big">
      <div class="message-left">
        <avatar :userId="user._id" :big="true" :update="true"/>
      </div>
      <div class="message-right">
        <div class="message-info">
          <span class="message-username">{{user.username}}</span>:
          <span class="message-time">{{timestampToTime(message.time)}}</span>
        </div>
        <div class="message-text">
          {{message.messageText}}
        </div>
      </div>
    </template>
    <template v-else>
      <div class="message-left">

      </div>
      <div class="message-right">
        {{message.messageText}}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'message',
  props: {
    messageId: {
      required: true,
      type: String
    },
    big: {
      type: Boolean
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
      return this.$store.state.users[this.message.user];
    }
  },
  mounted() {
    //stuff
    if (this.$store.state.messages[this.messageId]) {
      this.loading = false;
    }

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
      if (date < 10) {
        date = '0' + date;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (min < 10) {
        min = '0' + min;
      }
      if (sec < 10) {
        sec = '0' + sec;
      }
      var time = month + ' ' + date + ' ' + hour + ':' + min + ':' + sec ;
      return time;
    }
  }
}

</script>


<style>
/* red */
.message {
  display: flex;
  background-color: #ec7f7f;
  padding-left: 4px;
  padding-right: 4px;
}
.message-left {
  flex-basis: 2em;
}
.message-right {
  padding-left: 4px;
  padding-right: 4px;
  flex-grow: 2;
  min-width: 0;
}
.message-text {
  overflow-wrap: break-word;
}
.message-info {
  height: 1em;
  padding-bottom: 3px;
  display: flex;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.message-username {
  font-weight: bold;
  line-height: 1em;
}
.message-time {
  font-weight: lightest;
  color: rgba(0, 0, 0, 0.57);
  line-height: 1em;
}
</style>
