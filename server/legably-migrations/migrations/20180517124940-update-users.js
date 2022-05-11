'use strict';

let moment = require('moment');
module.exports = {

  up(db, next) {
    db.collection('users').find({$where: "this.job_seeker_info.experience.length > 0"}, function(err, resp) {
      resp.forEach(function(doc) {
        for(let obj of doc['job_seeker_info']['experience']) {
          obj['start_date'] = obj['start_date'] ? moment(obj['start_date']).utc().format('MM/DD/YYYY') : '';
          obj['end_date'] = obj['end_date'] ? moment(obj['end_date']).utc().format('MM/DD/YYYY') : '';
        }
        db.collection('users').update({_id: doc['_id']}, {$set: doc}, {upsert: false});
      }, next);
    });
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('users').find({$where: "this.job_seeker_info.experience.length > 0"}, function(err, resp) {
      resp.forEach(function(doc) {
        for(let obj of doc['job_seeker_info']['experience']) {
          obj['start_date'] = obj['start_date'] ? moment.parseZone(obj['start_date']).format() : null;
          obj['end_date'] = obj['end_date'] ? moment.parseZone(obj['end_date']).format() : null;
        }
        db.collection('users').update({_id: doc['_id']}, {$set: doc}, {upsert: false});
      }, next);
    });
  }

};
