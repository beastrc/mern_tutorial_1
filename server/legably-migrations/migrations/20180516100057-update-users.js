'use strict';

module.exports = {

  up(db, next) {
    db.collection('users').update({'job_posters_info.last_visited_page': 1}, {$set: {'job_posters_info.is_profile_completed': 'Y'}}, {upsert: false, multi: true}, next);
    db.collection('users').update({'job_posters_info.last_visited_page': 2}, {$set: {'job_posters_info.last_visited_page': 1}}, {upsert: false, multi: true}, next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('users').update({'job_posters_info.last_visited_page': 1}, {$set: {'job_posters_info.is_profile_completed': 'N'}}, {upsert: false, multi: true}, next);
  }

};
