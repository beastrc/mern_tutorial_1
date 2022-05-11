const socket = require('socket.io');

const messages = require('./messages');
const chatrooms = require('./chatrooms');

const TIME_TO_WAIT_BEFORE_STORE_IN_DB = 15000;

const buildConnection = server => {
  const io = socket(server);

  let messagesToStoreInDb = [];

  let activeUsers = [];
  let users = {};

  io.sockets.on('connection', socket => {
    console.log('---socket connection done successfully...', socket.id);

    socket.on('message', data => {
      console.log(data.senderId + ':' + data.receiverId);
      socket.broadcast.emit(data.senderId + ':' + data.receiverId, data);
    });

    /*

    socket.on('disconnect', () => {
      console.log('socket disconnected...', socket.id)
      activeUsers = activeUsers.filter((activeUser) => { return activeUser != users[socket.id]['userId'] })
      
      // send to all except the sender
      socket.broadcast.emit('onlineUser', activeUsers)
    });

    socket.on('onlineUser', (data) => {
      console.log('data is', data)
      if (data) {
        users[socket.id] = { "userId": data }

        if (activeUsers.indexOf(data) == -1) {
          activeUsers.push(data)
        }
      }

      // send to all clients including sender most important don't forget
      io.emit('onlineUser', activeUsers)
    })    
*/
  });
};

module.exports = {
  buildConnection
};
