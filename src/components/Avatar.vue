<template>
  <img class="avatar" v-bind:src="avatarSrc" v-bind:style="big ? 'max-width: 2em; max-height: 2em' : 'max-width: 1em; max-height: 1em'"/>
</template>

<script>
export default {
  name: 'avatar',
  props: {
    userId: {
      type: String,
      required: true
    },
    src: {
      type: String
    },
    update: {
      type: Boolean,
      required: true
    },
    big: {
      type: Boolean,
    }

  },
  computed: {
    avatarSrc() {
      if (this.update == true) {
        return this.$store.state.users[this.userId].avatar;
      } else {
        return this.src
      }
    },

  }
}
</script>


<style>
.avatar {
  max-width: 1em;
  max-height: 1em;
}
</style>
