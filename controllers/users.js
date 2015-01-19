var app = require('../reshare-app'),
    userStore = require('../data/user-store'),
    auth = require('../utils/auth'),
    promiseResponse = require('../utils/promise-response');

// Routes

app.get('/api/users', auth.isAuthenticated, listUsers);
app.get('/api/users/me', auth.isAuthenticated, getMe);
app.get('/api/users/:id', auth.isAuthenticated, getUser);
app.post('/api/users', auth.isInRole(auth.role.ADMIN), upsertUser);
app.delete('/api/users/:id', auth.isInRole(auth.role.ADMIN), disableUser);


// listUsers lists all users in the system
function listUsers (req, res) {
  promiseResponse(userStore.find({}), res);
}

// getMe gets the currently logged in user
function getMe(req, res) {
  res.json(req.user);
}

// getUser gets a user by id
function getUser (req, res) {
  promiseResponse(userStore.findOne({ userId: req.params.id }), res);
}

// Adds/updates a user in a format like this:
// {
//   userId: 'gihubid',
//   role: 'admin'
// }
function upsertUser (req, res) {
  var user = {
    userId: req.body.userId,
    role: req.body.role
  };

  if (!auth.isValidRole(user.role)) {
    res.status(400).json({ message: 'Role "' + user.role + '" is not valid' });
  } else {
    promiseResponse(userStore.save(user), res);
  }
};

// disableUser disables the specified user
function disableUser (req, res) {
  var query = { userId: req.params.id },
      update = { $set: { disabled: true } };

  promiseResponse(userStore.update(query, update), res);
}
