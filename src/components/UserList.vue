<template>
  <div class="chat-userlist" v-if="!loading">
    <div v-for="memberId in channel.members" :key="memberId">
      <chat-userlist-user :userId="memberId" :update="true"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chat-userlist',
  props: {
    channelId: {
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
    channel() {
      return this.$store.state.channels[this.channelId];
    }
  },
  created() {
    this.$store.dispatch('getChannel', this.channelId).then((response) => {
      this.loading = false;
    });
  }
}
</script>

<style>
.chat-userlist {
  height: 100%;
  overflow-y: scroll;
}

</style>
