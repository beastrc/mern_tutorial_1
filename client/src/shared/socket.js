import io from 'socket.io-client';

const Socket = () => {
  const socket = io.connect('/');
  socket.on('connect', (...rest) => {
    console.log('client connected!');
    console.log(rest);
  });
  const registerHandler = (onMessageReceived) => {
    socket.on('message', onMessageReceived);
  };

  const unregisterHandler = () => {
    socket.off('message');
  };

  socket.on('error', (err) => {
    console.log('received socket error:');
    console.log(err);
  });

  const register = (email, cb) => {
    socket.emit('register', email, cb);
  };

  const join = (chatroom, cb) => {
    socket.emit('join', chatroom, cb);
  };

  const leave = (chatroom, cb) => {
    socket.emit('leave', chatroom, cb);
  };

  const message = (chatroom, msg, cb) => {
    socket.emit('message', { chatroom, message: msg }, cb);
  };

  const getChatrooms = (cb) => {
    socket.emit('chatrooms', null, cb);
  };

  const getChatroomUsers = (chatroom, cb) => {
    socket.emit('chatroomUsers', chatroom, cb);
  };

  const updateChatrooms = () => {
    socket.emit('updateChatrooms');
  };

  return {
    register,
    join,
    leave,
    message,
    getChatrooms,
    getChatroomUsers,
    updateChatrooms,
    registerHandler,
    unregisterHandler
  };
};

export default (() => {
  let instance;

  const createInstance = () => {
    return Socket();
  };

  return {
    io: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();
