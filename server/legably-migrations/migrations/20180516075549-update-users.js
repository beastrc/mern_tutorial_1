'use strict';

module.exports = {

  up(db, next) {
    db.collection('users').update({status: 'Y'}, {$set: {status: 1}}, {upsert: false, multi: true}, next);
    db.collection('users').update({status: 'N'}, {$set: {status: 0}}, {upsert: false, multi: true}, next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('users').update({status: 1}, {$set: {status: 'Y'}}, {upsert: false, multi: true}, next);
    db.collection('users').update({status: 0}, {$set: {status: 'N'}}, {upsert: false, multi: true}, next);
  }

};
