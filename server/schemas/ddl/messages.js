var rfr = require('rfr'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

const ChatRoom = require('./chatrooms');
const users = require('./users');

const MessageSchema = new Schema({
  chatroom: {
    type: ObjectId,
    ref: ChatRoom
  },
  senderId: {
    type: ObjectId,
    ref: users
  },
  receiverId: {
    type: ObjectId,
    ref: users
  },
  message: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});
MessageSchema.options.toJSON = {
  transform: (doc, ret, options) => {
    ret.id = `${ret._id}`;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
};
module.exports = mongoose.model('Message', MessageSchema);
