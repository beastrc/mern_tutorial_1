'use strict';

module.exports = {

  up(db, next) {
    // TODO write your migration here
    db.collection('users').update({}, {$unset: {'job_posters_info.job_post_id': 1}}, {upsert: false, multi: true}, next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    next();
  }

};
