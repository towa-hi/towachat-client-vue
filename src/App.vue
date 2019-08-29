<template>
  <div id="app">
    <h1>user logged in: {{self.username}}</h1>
    <ul>
      <li>id: {{self._id}}</li>
      <li>username: {{self.username}}</li>
      <li>avatar: {{self.avatar}}</li>
      <li>handle: {{self.handle}}</li>
      <li>token: {{localStorageToken}}</li>
      <ul id="userChannelList">
        <li v-for="channel in self.channels">
          <ul id="channelInfo">
            <li>name: {{channel.name}}</li>
            <li>description: {{channel.description}}</li>
            <li>avatar: {{channel.avatar}}</li>
            <li>id: {{channel._id}}</li>
            <li><button type="button" v-on:click="leaveChannel(channel._id)">leave channel</button></li>
          </ul>
        </li>
      </ul>
    </ul>
    <div id="login">
      <input type="username" name="username" v-model="loginInput.username" placeholder="Username" />
      <input type="password" name="password" v-model="loginInput.password" placeholder="Password" />
      <button class="logIn" v-on:click="login(loginInput.username,loginInput.password)">login</button>
      <button class="logOut" v-on:click="logout()">logout</button>
    </div>
    <div id="register">
      <input type="text" name="username" v-model="registerInput.username" placeholder="Username" />
      <input type="password" name="password" v-model="registerInput.password" placeholder="Password" />
      <input type="password" name="passwordVerify" v-model="registerInput.passwordVerify" placeholder="Password again" />
      <button type="button" v-on:click="register(registerInput.username, registerInput.password, registerInput.passwordVerify)">register</button>
    </div>
    <div id="editSelf">
      <input type="text" name="avatar" v-model="editSelfInput.avatar" placeholder="avatar" />
      <input type="text" name="handle" v-model="editSelfInput.handle" placeholder="handle" />
      <button type="button" v-on:click="editSelf(editSelfInput.avatar, editSelfInput.handle)">edit self info</button>
    </div>
    <div id="createChannel">
      <input type="text" name="createChannelName" v-model="createChannelInput.name" placeholder="name" />
      <input type="text" name="createChannelDescription" v-model="createChannelInput.description" placeholder="description" />
      <button type="button" v-on:click="createChannel(createChannelInput.name, createChannelInput.description, createChannelInput.isPublic)">create channel</button>
    </div>
    <div id="editChannel">
      <input type="text" name="editChannelChannelId" v-model="editChannelInput.channelId" placeholder="channelId" />
      <input type="text" name="editChannelName" v-model="editChannelInput.name" placeholder="name" />
      <input type="text" name="editChannelDescription" v-model="editChannelInput.description" placeholder="description" />
      <input type="text" name="editChannelAvatar" v-model="editChannelInput.avatar" placeholder="avatar" />
      <button type="button" v-on:click="editChannel(editChannelInput.channelId, editChannelInput.name, editChannelInput.description, editChannelInput.isPublic, editChannelInput.avatar)">edit channel</button>
    </div>
    <div id="deleteChannel">
      <input type="text" name="deleteChannelId" v-model="deleteChannelInput.channelId" placeholder="channelId" />
      <button type="button" v-on:click="deleteChannel(deleteChannelInput.channelId)">submit</button>
    </div>
    <button type="button" v-on:click="prune()">prune channels</button>
    <button type="button" v-on:click="getChannels()">get channels</button>
    <ul id="channelList">
      <li v-for="channel in channelList">
        <ul id="channelInfo">
          <li>name: {{channel.name}}</li>
          <li>description: {{channel.description}}</li>
          <li>avatar: {{channel.avatar}}</li>
          <li>id: {{channel._id}}</li>
          <li><button type="button" v-on:click="joinChannel(channel._id)">join channel</button></li>
        </ul>
      </li>
    </ul>
  </div>

</template>

<script src="./App.js"></script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
