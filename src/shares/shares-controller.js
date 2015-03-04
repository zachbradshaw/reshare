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
.controller('SharesCtrl', ['$location', 'shares', 'shareService', 'Share',
  'voteService', function ($location, shares, shareService, Share, voteService) {

  var self = this;

  self.shares = shares;
  self.share = Share();

  self.upvote = function (share) {
    voteService.upvote(share);
  };

  self.downvote = function (share) {
    voteService.downvote(share);
  };

  self.remove = function (id) {
    shareService.deleteShare(id);
  };

  self.goToComments = function (id) {
    $location.path('/shares/' + id + '/comments');
  };

}]);
