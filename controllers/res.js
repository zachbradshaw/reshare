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
app.post('/api/res/:id/votes', auth.isAuthenticated, vote);

// apiFriendlyResource makes the specified resource
// less data-specific
function apiFriendlyResource (resource) {
  return {
    _id: resource._id,
    upvotes: resource.upvotes.length,
    downvotes: resource.downvotes.length,
    url: resource.url,
    description: resource.description,
    userId: resource.userId,
    tags: resource.tags
  };
}

// listResources lists all resources
function listResources (req, res) {
  var promise = resStore.find({})
    .then(function (resources) {
      return resources.map(apiFriendlyResource);
    });

  promiseResponse(promise, res);
}

// getResource gets a single resource by id
function getResource (req, res) {
  var promise = resStore.findOne({ _id: req.params.id })
    .then(function (resource) {
      return apiFriendlyResource(resource);
    });

  promiseResponse(promise, res);
}

// upsertResource adds/updates a resource
function upsertResource (req, res) {
  var resource = {
    userId: req.user.userId,
    url: req.body.url,
    description: req.body.description,
    tags: req.body.tags || [],
    upvotes: [],
    downvotes: []
  };

  // hacky way to not blow away existing resources
  // when saving
  var promise = resStore.findOne({ url: resource.url })
    .then(function (existing) {
      if (!existing) {
        existing = resource;
      } else {
        existing.description = resource.description;
        existing.tags = resource.tags;
      }

      return resStore.save(existing);
    });

  promiseResponse(promise, res);
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

// vote upvotes or downvotes depending on the value
// of the vote parameter
function vote (req, res) {
  var voteValue = req.body.vote > 0 ? 1 : req.body.vote < 0 ? -1 : 0;
  var promise = resStore.vote({
    resId: req.params.id,
    userId: req.user.userId,
    vote: voteValue
  });

  promiseResponse(promise, res);
}
