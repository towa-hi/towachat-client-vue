const SocketIO = require('socket.io-client');
import store from './store';
const config = require('../config/main');

const socket = SocketIO.connect(config.SERVER_URL);
//
// function initSocket(socket) {
//   socket.on('connect', () => {
//     //unauth'd socket emits and ons go here
//     console.log('socket has connected');
//     store.dispatch('connected', true);
//     socket.on('wewlad', (data) => {
//       console.log(data);
//     });
//
//     socket.emit('anything');
//
//     socket.on('newUser', (user) => {
//       console.log('recieved newUser ' + user.username);
//       store.commit('addUser', user);
//     });
//
//     socket.on('newChannel', (channel) => {
//       console.log('received ')
//       store.commit('addChannel', channel);
//     });
//
//     socket.emit('authenticate', {token: localStorage.token}).on('authenticated', () => {
//       console.log('authd');
//
//       socket.on('newSelf', (selfId) => {
//         store.dispatch('authenticated', selfId);
//         store.dispatch('setSelf', selfId);
//       });
//
//       socket.on('newToken', (token) => {
//         localStorage.setItem('token', token);
//       });
//
//     }).on('unauthorized', (msg) => {
//       console.log('unauthd' + JSON.stringify(msg.data));
//     });
//   });
// }

export default socket;
