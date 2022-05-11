'use strict';

module.exports = {

  up(db, next) {
    db.collection('user_logs').rename('logged_in_users', next);
    db.collection('rate_settings').rename('service_charges', next);
    db.collection('interested_in_hirings').rename('categories', next);
    db.collection('settings').rename('work_locations', next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('logged_in_users').rename('user_logs', next);
    db.collection('service_charges').rename('rate_settings', next);
    db.collection('categories').rename('interested_in_hirings', next);
    db.collection('work_locations').rename('settings', next);
  }

};
