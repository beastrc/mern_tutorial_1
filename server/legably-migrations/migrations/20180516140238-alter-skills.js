'use strict';

module.exports = {

  up(db, next) {
    db.collection('skills').find({}, function(err, resp) {
      resp.forEach(function(doc) {
        var timestamp = doc['_id'].getTimestamp();
        db.collection('skills').update({_id: doc['_id']}, {$set: {created_at: timestamp, updated_at: timestamp}}, {upsert: false});
      }, next);
    });
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('skills').update({}, {$unset: {created_at: 1, updated_at: 1}}, {upsert: false, multi: true}, next);
  }

};
