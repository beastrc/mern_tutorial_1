'use strict';

module.exports = {

  up(db, next) {
    db.collection('post_jobs').update({}, {$set: {others: '', showOthers: 'false'}}, {upsert: false, multi: true}, next);
    db.collection('post_jobs').update({'skillsNeeded.label': 'Others'}, {$set: {showOthers: 'true'}}, {upsert: false, multi: true}, next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('post_jobs').update({}, {$unset: {others: 1, showOthers: 1}}, {upsert: false, multi: true}, next);
  }

};
