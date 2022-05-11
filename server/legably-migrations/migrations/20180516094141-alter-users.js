'use strict';

module.exports = {

  up(db, next) {
    db.collection('users').update({'is_email_verified': {$exists : false}}, {$set: {'is_email_verified': false}}, {upsert: false, multi: true}, next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('users').update({'is_email_verified': {$exists : true, $in: [false]}}, {$unset: {'is_email_verified': 1}}, {upsert: false, multi: true}, next);
  }

};
