var Datastore = require('nedb'),
    Q = require('q'),
    dbs = {};

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

function DbCollection (name) {
  var db = dbs[name] || (dbs[name] = new Datastore());

  return {
    // ensureIndex works similarly to NEDB ensureIndex,
    // only returning a promise
    ensureIndex: function (options) {
      return dbMakePromise(function (callback) {
        db.ensureIndex(options, callback);
      });
    },

    // insert works as in NEDB, except returning
    // a promise
    insert: function (data) {
      return dbMakePromise(function (callback) {
        db.insert(data, callback);
      });
    },

    // update works similarly to NEDB update, only
    // returning a promise
    update: function (query, data, options) {
      return dbMakePromise(function (callback) {
        db.update(query, data, options || {}, callback);
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
    },

    // remove is just like NEDB's remove, except
    // returning a promise
    remove: function (query, options) {
      return dbMakePromise(function (callback) {
        db.remove(query, options || {}, callback);
      });
    }
  }
}

module.exports = {
  collection: DbCollection
};
