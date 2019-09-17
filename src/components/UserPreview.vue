<template>
  <div>
    {{user.username}}
  </div>
</template>

<script>

export default {
  name: 'user',
  props: {
    userId: {
      type: String
    }
  },
  data: function () {
    return {
      user: {},
    }
  },
  mounted() {
    // this.getUser();
    // if im not subbed to this
    this.$store.dispatch('getEphemeralUser', this.userId).then((response) => {
      console.log('GOT RESPONSE');
      this.user = response;
      console.log(response);
    });
  }
}
</script>
