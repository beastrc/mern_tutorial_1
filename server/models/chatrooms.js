const mongoose = require('mongoose');
var rfr = require('rfr');

var chatRoomSchema = rfr('/server/schemas/ddl/chatrooms');
var messageSchema = rfr('/server/schemas/ddl/messages');

var constant = rfr('/server/shared/constant'),
  utils = rfr('/server/shared/utils');

var helper = rfr('/server/models/shared/helper');

const getChatRooms = (req, res) => {
  console.log('!!!!!!!!!!', req.body);
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  // todo pagination, filtering
  let category = 'PUBLIC';
  if (req.query.category) category = req.query.category;
  var resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      if (req.body.keyword == '') {
        chatRoomSchema.aggregate(
          [
            {
              $match: {
                $or: [
                  { user_poster: mongoose.Types.ObjectId(result._id) },
                  { user_seeker: mongoose.Types.ObjectId(result._id) }
                ]
              }
            },
            { $sort: { timestamp: -1 } },
            {
              $lookup: {
                from: 'users',
                localField: 'user_poster',
                foreignField: '_id',
                as: 'user_poster'
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'user_seeker',
                foreignField: '_id',
                as: 'user_seeker'
              }
            },
            { $unwind: '$user_poster' },
            { $unwind: '$user_seeker' }
          ],
          function(err, chatrooms) {
            console.log('CCCC', chatrooms);
            if (err) return res.status(500).json(err);
            if (chatrooms != []) {
              resObj = Object.assign({}, utils.getSuccessResObj());
              resObj['results'] = {
                chatrooms: chatrooms
              };
              utils.callCB(cb, resObj);
            }
          }
        );
      } else {
        chatRoomSchema.aggregate(
          [
            {
              $match: {
                $or: [
                  { user_poster: mongoose.Types.ObjectId(result._id) },
                  { user_seeker: mongoose.Types.ObjectId(result._id) }
                ]
              }
            },
            { $sort: { timestamp: -1 } },
            {
              $lookup: {
                from: 'users',
                localField: 'user_poster',
                foreignField: '_id',
                as: 'user_poster'
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'user_seeker',
                foreignField: '_id',
                as: 'user_seeker'
              }
            },
            { $unwind: '$user_poster' },
            { $unwind: '$user_seeker' },
            {
              $lookup: {
                from: 'messages',
                localField: '_id',
                foreignField: 'chatroom',
                as: 'messages'
              }
            },
            // { $unwind: '$messages' },
            {
              $match: {
                'messages.message': { $regex: req.body.keyword, $options: 'i' }
              }
            },
            {
              $unset: 'messages'
            }
          ],
          function(err, chatrooms) {
            console.log('sesssssss', chatrooms);
            if (err) return res.status(500).json(err);
            //if (chatrooms != []) {
            resObj = Object.assign({}, utils.getSuccessResObj());
            resObj['results'] = {
              chatrooms: chatrooms
            };
            utils.callCB(cb, resObj);
            //}
          }
        );
      }

      // chatRoomSchema
      //   .find(
      //     {
      //       $or: [
      //         { user_poster: mongoose.Types.ObjectId(result._id) },
      //         { user_seeker: mongoose.Types.ObjectId(result._id) }
      //       ]
      //     },
      //     (err, chatrooms) => {
      //       if (err) return res.status(500).json(err);
      //       console.log('CCCC', chatrooms);
      //       if (chatrooms != []) {
      //         resObj = Object.assign({}, utils.getSuccessResObj());
      //         resObj['results'] = {
      //           chatrooms: chatrooms
      //         };
      //         utils.callCB(cb, resObj);
      //       }
      //     }
      //   )
      //   .populate('user_poster')
      //   .populate('user_seeker')
      //   .sort({ timestamp: -1 });
    }
  });
};

const postChatRoom = (req, res) => {
  var cb = function(result) {
    utils.sendResponse(res, result);
  };
  console.log('post chat room called');
  var resObj = Object.assign({}, utils.getErrorResObj());
  helper.checkUserLoggedIn(req.headers.token, function(err, result) {
    if (err) {
      resObj['message'] = constant['AUTH_FAIL'];
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      utils.callCB(cb, resObj);
    } else {
      const { job_status, user_seeker, room_title } = req.body;
      return chatRoomSchema.findOne({ job_status }).then(chatroom => {
        if (chatroom) {
          return res
            .status(400)
            .json({ error: 'Chatroom already exists for this job' });
        }
        const new_chat_room = {
          job_status,
          user_seeker,
          user_poster: result._id,
          room_title: room_title
        };
        const newChatroom = new chatRoomSchema(new_chat_room);
        return newChatroom.save().then(chatroom => {
          resObj = Object.assign({}, utils.getSuccessResObj());
          resObj['data'] = {
            chatroom: chatroom
          };
          utils.callCB(cb, resObj);
        });
      });
    }
  });
};

const putChatRoom = (req, res) => {
  const { id, name, description, icon, category } = req.body;
  chatRoomSchema
    .findOneAndUpdate({ _id: id }, { name, description, icon, category })
    .then((err, user) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (!user) {
        return res.status(400).json({
          id: 'Chatroom does not exists'
        });
      }
      return res.status(200).json({ success: 'Changes saved' });
    });
};

const deleteChatRoom = (req, res) => {
  chatRoomSchema.deleteOne({ _id: req.params.id }, err => {
    err ? res.status(500).json(err) : res.json({ success: 'Deleted' });
  });
};

module.exports = {
  getChatRooms,
  postChatRoom,
  putChatRoom,
  deleteChatRoom
};
