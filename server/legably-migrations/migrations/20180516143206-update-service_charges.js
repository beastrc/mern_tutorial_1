'use strict';

module.exports = {

  up(db, next) {
    db.collection('service_charges').update({}, {'$rename': {'currentRate': 'service_charge', 'created': 'created_at', 'modified': 'updated_at'}}, {upsert: false, multi: true}, next);
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('service_charges').update({}, {'$rename': {'service_charge': 'currentRate', 'created_at': 'created', 'updated_at': 'modified'}}, {upsert: false, multi: true}, next);
  }

};
