'use strict';

module.exports = {

  up(db, next) {
    db.collection('post_jobs').find({}, function(err, resp) {
      resp.forEach(function(doc) {
        db.collection('post_jobs').update({_id: doc['_id']}, {$set: {posted_at: doc['created_at']}}, {upsert: false});
      }, next);
    });
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('post_jobs').update({}, {$unset: {posted_at: 1}}, {upsert: false, multi: true}, next);
  }

};
