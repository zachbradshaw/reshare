var app = require('../reshare-app'),
    userStore = require('../data/user-store');

app.get('/api/users', listUsers);
app.get('/api/users/:id', getUser);
app.put('/api/users/:id', updateUser);
app.post('/api/users/:id', addUser);
app.delete('/api/users/:id', disableUser);

function listUsers (req, res) {
  userStore.list({}).then(function (result) {
    res.json(result || []);
  }).catch(function (err) {
    res.status(500).json(err);
  });
}

function getUser (req, res) {
  return userStore.list({ userId: req.params.id })
    .then(function (result) {
      res.json(result || []);
    }).catch(function (err) {
      res.status(500).json(err);
    });
}

function addUser (req, res) {
  res.send('Added, user!');
}

function updateUser (req, res) {
  res.send('Updated, user!');
}

function disableUser (req, res) {
  res.send('Disabled, user!');
}

// Export the index view so it can optionally
// be configured as a default route
module.exports = function () {
  return {
    index: listUsers
  };
};
