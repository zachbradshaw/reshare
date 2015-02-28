// The root module for our Angular application
var app = angular.module('app', ['ngRoute']);

app.factory('commentService', ['$http', function($http) {

}]);

app.factory('Comment', function () {
  return function (spec) {
    spec = spec || {};
    return {
      userId: spec.userId,
      content: spec.content,
      created: new Date.now()
    }
  }
});

app.controller('MainNavCtrl',
  ['$location', 'StringUtil', function($location, StringUtil) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }

      return StringUtil.startsWith($location.path(), path);
    };
  }]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shares/new-share', {
    controller: 'NewShareCtrl',
    controllerAs: 'vm',
    templateUrl: 'shares/new-share.html'
  });
}]).controller('NewShareCtrl', ['$location', 'Share', 'shareService', function($location, Share, shareService) {
  var self = this;

  self.share = Share();

  self.cancelEditing = function () {
    self.goToShares();
  };

  self.goToShares = function () {
    $location.path('/shares');
  };

  self.addShare = function () {
    shareService.addShare(self.share).then(self.goToShares);
  }
}]);

app.factory('Share', function () {
  return function (spec) {
    spec = spec || {};
    return {
      url: spec.url,
      description: spec.description,
      tags: spec.tags
    };
  };
});

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    resolve: {
      shares: ['shareService', function (shareService) {
        return shareService.getShareList();
      }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['shares', 'shareService', 'Share', 'voteService', function (shares, shareService, Share, voteService) {

  var self = this;

  self.shares = shares;

  self.upvote = function (share) {
    voteService.upvote(share);
  };

  self.downvote = function (share) {
    voteService.downvote(share);
  };

}]);

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'users/user.html',
    controller: 'UserCtrl',
    controllerAs: 'vm',
    resolve: {
      user: ['$route', 'usersService', function ($route, usersService) {
        var routeParams = $route.current.params;
        return usersService.getByUserId(routeParams.userid);
      }]
    }
  };

  $routeProvider.when('/users/:userid', routeDefinition);
}])
.controller('UserCtrl', ['user', function (user) {
  this.user = user;
}]);

app.factory('User', function () {
  return function (spec) {
    spec = spec || {};
    return {
      userId: spec.userId || '',
      role: spec.role || 'user'
    };
  };
});

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'users/users.html',
    controller: 'UsersCtrl',
    controllerAs: 'vm',
    resolve: {
      users: ['usersService', function (usersService) {
        return usersService.list();
      }]
    }
  };

  $routeProvider.when('/users', routeDefinition);
}])
.controller('UsersCtrl', ['users', 'usersService', 'User', function (users, usersService, User) {
  var self = this;

  self.users = users;

  self.newUser = User();

  self.addUser = function () {
    // Make a copy of the 'newUser' object
    var user = User(self.newUser);

    // Add the user to our service
    usersService.addUser(user).then(function () {
      // If the add succeeded, remove the user from the users array
      self.users = self.users.filter(function (existingUser) {
        return existingUser.userId !== user.userId;
      });

      // Add the user to the users array
      self.users.push(user);
    });

    // Clear our newUser property
    self.newUser = User();
  };
}]);

// A little string utility... no biggie
app.factory('StringUtil', function() {
  return {
    startsWith: function (str, subStr) {
      str = str || '';
      return str.slice(0, subStr.length) === subStr;
    }
  };
});

app.factory('shareService', ['$http', '$log', function($http, $log) {
  // My $http promise then and catch always
  // does the same thing, so I'll put the
  // processing of it here. What you probably
  // want to do instead is create a convenience object
  // that makes $http calls for you in a standard
  // way, handling post, put, delete, etc
  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function post(url, share) {
    return processAjaxPromise($http.post(url, share));
  }

  function remove(url) {
    return processAjaxPromise($http.delete(url));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      return result.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
    getShareList: function () {
      return get('/api/res');
    },

    getShare: function (id) {
      return get('/api/res/' + id);
    },

    addShare: function (share) {
      return post('/api/res', share);
    },

    deleteShare: function (id) {
      return remove('/api/res/' + id);
    }
  };
}]);

app.factory('voteService', ['$http', function($http) {
  function post(url, data) {
    return processAjaxPromise($http.post(url, data));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      return result.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
    upvote: function (id) {
      alert('UPVOTE');
      return post('/api/res/' + id + '/votes', { vote: 1 });
    },

    downvote: function (id) {
      return post('/api/res/' + id + '/votes', { vote: -1 });
    }
  };
}]);

app.factory('usersService', ['$http', '$q', '$log', function($http, $q, $log) {
  // My $http promise then and catch always
  // does the same thing, so I'll put the
  // processing of it here. What you probably
  // want to do instead is create a convenience object
  // that makes $http calls for you in a standard
  // way, handling post, put, delete, etc
  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      return result.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
    list: function () {
      return get('/api/users');
    },

    getByUserId: function (userId) {
      if (!userId) {
        throw new Error('getByUserId requires a user id');
      }

      return get('/api/users/' + userId);
    },

    addUser: function (user) {
      return processAjaxPromise($http.post('/api/users', user));
    }
  };
}]);

//# sourceMappingURL=app.js.map