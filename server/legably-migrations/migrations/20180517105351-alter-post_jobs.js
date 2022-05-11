'use strict';

module.exports = {

  up(db, next) {
    db.collection('post_jobs').find({}, function(err, resp) {
      resp.forEach(function(doc) {
        for(var sObj of doc['skillsNeeded']) {
          delete sObj['status'];
          delete sObj['name'];
          delete sObj['_id'];
        }

        for(var pObj of doc['practiceArea']) {
          delete pObj['status'];
          delete pObj['name'];
          delete pObj['_id'];
        }

        db.collection('post_jobs').update({_id: doc['_id']}, {$set: doc}, {upsert: false});
      }, next);
    });
  },

  down(db, next) {
    // TODO write the statements to rollback your migration (if possible)
    db.collection('post_jobs').find({}, function(err, resp) {
      resp.forEach(function(doc) {
        for(var sObj of doc['skillsNeeded']) {
          sObj['status'] = 'true';
          sObj['name'] = sObj['label'];
          sObj['_id'] = sObj['value'];
        }

        for(var pObj of doc['practiceArea']) {
          pObj['status'] = 'true';
          pObj['name'] = pObj['label'];
          pObj['_id'] = pObj['value'];
        }

        db.collection('post_jobs').update({_id: doc['_id']}, {$set: doc}, {upsert: false});
      }, next);
    });
  }

};
