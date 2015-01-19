var db = require('./db').collection('res');

// Ensure the db has indexed url
db.ensureIndex({
  fieldName: 'url',
  unique: true
});

// Build a query by url
function resUrlQuery(res) {
  return { url: res.url };
}

var resStore = {
  // save a resource
  // resources have a shape like this:
  // {
  //    url: 'http://link/to/resource',
  //    description: 'a short description',
  //    tags: ['tag1', 'tag2']
  // }
  save: function (res) {
    var options = { upsert: true };
    return db.update(resUrlQuery(res), res, options);
  },

  // list resources
  find: function (query) {
    return db.find(query);
  },

  // find one resource
  findOne: function (query) {
    return db.findOne(query);
  },

  remove: function (query) {
    return db.remove(query);
  }
};

module.exports = resStore;
