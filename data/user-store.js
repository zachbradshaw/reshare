var db = require('./db');

// Ensure the db has indexed userId
db.ensureIndex({
  fieldName: 'userId',
  unique: true
});

// Build a query by user id
function userIdQuery(user) {
  return { userId: user.userId };
}

var userStore = {
  // save a user
  save: function (user) {
    var options = { upsert: true };
    return db.update(userIdQuery(user), user, options);
  },

  // list users
  find: function (query) {
    return db.find(query);
  },

  // find one user
  findOne: function (query) {
    return db.findOne(query);
  }
};

module.exports = userStore;
