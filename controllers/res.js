var app = require('../reshare-app'),
    resStore = require('../data/res-store'),
    commentStore = require('../data/comment-store'),
    auth = require('../utils/auth'),
    promiseResponse = require('../utils/promise-response');

// Routes

app.get('/api/res', listResources);
app.get('/api/res/:id', getResource);
app.post('/api/res', auth.isAuthenticated, upsertResource);
app.delete('/api/res/:id', auth.isAuthenticated, deleteResource);


// listResources lists all resources
function listResources (req, res) {
  promiseResponse(resStore.find({}), res);
}

// getResource gets a single resource by id
function getResource (req, res) {
  promiseResponse(resStore.findOne({ _id: req.params.id }), res);
}

// upsertResource adds/updates a resource
function upsertResource (req, res) {
  promiseResponse(resStore.save(req.body), res);
}

// deleteResource deletes a resource
function deleteResource (req, res) {
  var promise = commentStore
    .removeBySubjectId({
      subjectId: req.params.id
    })
    .then(function () {
      return resStore.remove({ _id: req.params.id });
    });

  promiseResponse(promise, res);
}
