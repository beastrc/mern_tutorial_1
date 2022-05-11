'use strict';

module.exports = {

  up(db, next) {
    db.collection('users').update({}, {$set: {'freeze_activity': false}}, {upsert: false, multi: true}, next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('users').update({}, {$unset: {'freeze_activity': 1}}, {upsert: false, multi: true}, next);
  }

};
