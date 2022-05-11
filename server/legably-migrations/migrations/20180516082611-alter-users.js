'use strict';

module.exports = {

  up(db, next) {
    db.collection('users').update({}, {$set: {'is_bar_id_valid': 'Yes'}}, {upsert: false, multi: true}, next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('users').update({}, {$unset: {'is_bar_id_valid': 1}}, {upsert: false, multi: true}, next);
  }

};
