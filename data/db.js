var Datastore = require('nedb'),
    Q = require('q'),
    db = new Datastore();

// dbMakePromise converts a non-promise-based
// db call into a promise-based db-call
// dbExec is a function which executes the db
// call. It takes a callback as a parameter
function dbMakePromise(dbExec) {
  var deferred = Q.defer();

  dbExec(function (err, result) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(result);
    }
  });

  return deferred.promise;
}

module.exports = {
  // ensureIndex works similarly to NEDB ensureIndex,
  // only returning a promise
  ensureIndex: function (options) {
    return dbMakePromise(function (callback) {
      db.ensureIndex(options, callback);
    });
  },

  // update works similarly to NEDB update, only
  // returning a promise
  update: function (query, data, options) {
    return dbMakePromise(function (callback) {
      db.update(query, data, options, callback);
    });
  },

  // find works similarly to NEDB find only
  // returning a promise
  find: function (query, projection) {
    return dbMakePromise(function (callback) {
      db.find(query, projection, callback);
    });
  },

  // findOne looks for a single user that
  // matches the query see NEDB for more details
  findOne: function (query, projection) {
    return dbMakePromise(function (callback) {
      db.findOne(query, projection, callback);
    });
  }
};
