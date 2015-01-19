var app = require('./reshare-app'),
    requireDir = require('require-dir'),
    usersApi = require('./controllers/users');

requireDir('./controllers', { recurse: true });

app.get('/', usersApi().index);

var server = app.listen(3000, function () {
  var host = server.address().address
      port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
