var rfr = require('rfr'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

const job_status = require('./jobStatus');
const users = require('./users');

const ChatRoomSchema = new Schema({
  job_status: {
    type: ObjectId,
    ref: job_status
  },
  user_poster: {
    type: ObjectId,
    ref: users
  },
  user_seeker: {
    type: ObjectId,
    ref: users
  },
  room_title: {
    type: String,
    default: null
  },
  room_category: {
    type: String,
    default: 'PRIVATE'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});
ChatRoomSchema.options.toJSON = {
  transform: (doc, ret, options) => {
    ret.id = `${ret._id}`;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
};
module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
