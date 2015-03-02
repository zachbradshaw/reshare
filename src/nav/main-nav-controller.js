app.controller('MainNavCtrl',
  ['$location', 'StringUtil', 'usersService', function($location, StringUtil, usersService) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }

      return StringUtil.startsWith($location.path(), path);
    };

    self.currentUser = function () {
      usersService.currentUser();
    }
  }]);
