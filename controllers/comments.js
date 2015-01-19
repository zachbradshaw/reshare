var app = require('../reshare-app'),
    resStore = require('../data/res-store'),
    commentStore = require('../data/comment-store'),
    auth = require('../utils/auth'),
    promiseResponse = require('../utils/promise-response');

// Routes

app.get('/api/res/:res_id/comments', listComments);
app.post('/api/res/:res_id/comments', auth.isAuthenticated, addComment);
app.delete('/api/res/:res_id/comments/:id', auth.isAuthenticated, deleteComment);


// listComments lists all comments for a subject (e.g. a resource)
function listComments (req, res) {
  promiseResponse(commentStore.find({ subjectId: req.params.res_id }), res);
}

// addComment adds a comment to the specified subject
function addComment (req, res) {
  var comment = {
    userId: req.user.userId,
    text: req.body.text,
    subjectId: req.params.res_id,
    created: new Date()
  };

  promiseResponse(commentStore.save(comment), res);
}

// deleteComment deletes a single comment
function deleteComment (req, res) {
  promiseResponse(commentStore.remove({ _id: req.params.id }), res);
}
