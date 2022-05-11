'use strict';

module.exports = {

  up(db, next) {
    db.collection('forgotpasswords').drop()
    next();
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    next();
  }

};
