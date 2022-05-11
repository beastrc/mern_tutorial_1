'use strict';

module.exports = {

  up(db, next) {
    db.collection('states').update({}, {$set: {status: 1}}, {upsert: false, multi: true}, next);
    db.collection('states').update({}, {'$rename': {'abbrev': 'abbr'}}, {upsert: false, multi: true}, next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('states').update({}, {$set: {status: true}}, {upsert: false, multi: true}, next);
    db.collection('states').update({}, {'$rename': {'abbr': 'abbrev'}}, {upsert: false, multi: true}, next);
  }

};
