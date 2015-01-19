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

  // vote adds an upvote or downvote
  // voteData should look like this:
  // {
  //   resId: resourceId,
  //   vote: 1, -1, 0
  //   userId: <the user id>
  // }
  vote: function (voteData) {
    var query = { _id: voteData.resId },
        update = { };

    function add(setName) {
      update.$addToSet = {};
      update.$addToSet[setName] = voteData.userId;
    }

    function remove(setName) {
      update.$pull = {};
      update.$pull[setName] = voteData.userId;
    }

    if (voteData.vote > 0) {
      add('upvotes');
      remove('downvotes');
    } else if (voteData.vote < 0) {
      add('downvotes');
      remove('upvotes');
    } else {
      remove('upvotes');
      remove('downvotes');
    }

    return db.update(query, update);
  },

  // remove removes the specified resource
  remove: function (query) {
    return db.remove(query);
  }
};

module.exports = resStore;
