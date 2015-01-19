var express = require('express'),
    bodyParser = require('body-parser'),
    everyauth = require('everyauth'),
    dotenv = require('dotenv'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    userStore = require('./data/user-store'),
    app = express();

// load environment variables from .env
dotenv.load();

// use cookies
app.use(cookieParser());

// use sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// upsert the global admin user
userStore.save({ userId: process.env.APP_SUPER_ADMIN, role: 'admin' });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// use everyauth to handle oauth
everyauth.github
  .appId(process.env.GITHUB_CLIENT_ID)
  .appSecret(process.env.GITHUB_CLIENT_SECRET)
  .findOrCreateUser(function (session, accessToken, accessTokenExtra, githubUserMetadata) {
    var promise = this.Promise();

    userStore.findOne({ userId: githubUserMetadata.login }).then(function (user) {
      promise.fulfill(user);
    }).catch(function (err) {
      promise.fulfill([err]);
    });

    return promise;
  })
  .redirectPath('/');

// configure everyauth to be able to look up the current user
everyauth.everymodule.userPkey('userId');
everyauth.everymodule.findUserById(function (userId, callback) {
  userStore.findOne({ userId: userId }).then(function (user) {
    callback(undefined, user);
  }).catch(function (err) {
    callback(err, undefined);
  });
});

// tell express to use everyauth
app.use(everyauth.middleware(app));

// Specify src as the place where public files are found
app.use(express.static(__dirname + '/src'));

module.exports = app;
