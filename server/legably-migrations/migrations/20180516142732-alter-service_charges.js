'use strict';

module.exports = {

  up(db, next) {
    db.collection('service_charges').update({}, {$set: {'status': 1}}, {upsert: false, multi: true}, next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('service_charges').update({}, {$unset: {'status': 1}}, {upsert: false, multi: true}, next);
  }

};
