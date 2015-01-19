var db = require('./db').collection('comments');


var commentStore = {
  // save a comment
  // comments have a shape like this:
  // {
  //    userId: 'githubuserid',
  //    text: 'The comment itself',
  //    created: new Date(),
  //    subjectId: 'theidoftheresource'
  // }
  save: function (comment) {
    return db.insert(comment);
  },

  // list comments for a subject this requires
  // the subjectId property
  find: function (query) {
    return db.find(query);
  },

  // remove removes a comment by coment id
  remove: function (query) {
    return db.remove(query);
  },

  // removeBySubjectId removes all comments for
  // a subject. subjectId is rquired in query
  removeBySubjectId: function (query) {
    return db.remove(query, { multi: true });
  }
};

module.exports = commentStore;
