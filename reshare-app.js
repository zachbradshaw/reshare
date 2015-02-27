var express = require('express'),
    bodyParser = require('body-parser'),
    everyauth = require('everyauth'),
    dotenv = require('dotenv'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    userStore = require('./data/user-store'),
    auth = require('./utils/auth'),
    config = require('./gulp/config'),
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
userStore.save({ userId: process.env.APP_SUPER_ADMIN, role: auth.role.ADMIN });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// use everyauth to handle oauth
everyauth.github
  .myHostname(process.env.HOST_NAME)
  .appId(process.env.GITHUB_CLIENT_ID)
  .appSecret(process.env.GITHUB_CLIENT_SECRET)
  .findOrCreateUser(function (session, accessToken, accessTokenExtra, githubUserMetadata) {
    var promise = this.Promise();

    var userRef = { userId: githubUserMetadata.login };
    console.log('Looking up ' + githubUserMetadata.login);
    userStore.findOne(userRef).then(function (user) {
      if (user) {
        return user;
      }

      user = {
        userId: userRef.userId,
        role: auth.role.USER
      };

      return userStore.save(user).then(function () {
        return userStore.findOne(userRef);
      });
    }).then(function (user) {
      promise.fulfill(user);
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
app.use(express.static(__dirname + config.dest.root.replace('.', '')));

module.exports = app;
