app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    resolve: {
      shares: ['shareService', function (shareService) {
        return shareService.getShareList();
      }]
      // upvotes: ['voteService', function (voteService) {
      //   return voteService.upvote();
      // }],
      // downvotes: ['voteService', function(voteService) {
      //   return voteService.downvote();
      // }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['$location', 'shares', 'shareService', 'Share',
  'voteService', function ($location, shares, shareService, Share, voteService) {

  var self = this;

  self.shares = shares;

  // self.votes = function(upvotes, downvotes) {
  //   return upvotes - downvotes;
  // };

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
