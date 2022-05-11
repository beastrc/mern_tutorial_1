'use strict';

module.exports = {

  up(db, next) {
    db.collection('logged_in_users').find({}, function(err, resp) {
      resp.forEach(function(doc) {
        var timestamp = doc['_id'].getTimestamp();
        db.collection('logged_in_users').update({_id: doc['_id']}, {$set: {created_at: timestamp, updated_at: timestamp}, $unset: {status: 1}}, {upsert: false});
      }, next);
    });
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('logged_in_users').update({}, {$unset: {created_at: 1, updated_at: 1}, $set: {status: true}}, {upsert: false, multi: true}, next);
  }

};
