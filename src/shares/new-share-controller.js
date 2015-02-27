app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shares/new-share', {
    controller: 'NewShareCtrl',
    controllerAs: 'vm',
    templateUrl: 'shares/new-share.html'
  });
}]).controller('NewShareCtrl', ['$location', 'Share', 'shareService', function(location, Share, resStore, shareService) {
  var self = this;

  self.share = Share();

  self.cancelEditing = function () {
    self.goToShares();
  };

  self.goToShares = function () {
    $location.path('/shares')
  };
}]);
