'use strict';

let moment = require('moment');
module.exports = {

  up(db, next) {
    db.collection('post_jobs').find({}, function(err, resp) {
      resp.forEach(function(doc) {
        doc['estimatedStartDate'] = doc['estimatedStartDate'] ? moment(doc['estimatedStartDate']).utc().format('MM/DD/YYYY') : '';
        for(let obj of doc['paymentDetails']) {
          obj['dueDate'] = obj['dueDate'] ? moment(obj['dueDate']).utc().format('MM/DD/YYYY') : '';
        }
        db.collection('post_jobs').update({_id: doc['_id']}, {$set: doc}, {upsert: false});
      }, next);
    });
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('post_jobs').find({}, function(err, resp) {
      resp.forEach(function(doc) {
        doc['estimatedStartDate'] = doc['estimatedStartDate'] ? moment.parseZone(doc['estimatedStartDate']).format() : null;
        for(let obj of doc['paymentDetails']) {
          obj['dueDate'] = obj['dueDate'] ? moment.parseZone(obj['dueDate']).format() : null;
        }
        db.collection('post_jobs').update({_id: doc['_id']}, {$set: doc}, {upsert: false});
      }, next);
    });
  }

};
