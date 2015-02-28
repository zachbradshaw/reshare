app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/comments', {
    controller: 'commentsCtrl',
    controllerAs: 'vm',
    templateUrl: 'comments/comments.html'
  });
}])
.controller('commentsCtrl', ['$location', 'commentService', 'Comment', function ($location, commentService, Comment) {
  var self = this;

  self.list = function (id) {
    commentService.getCommentList(id);
  };

  self.addComment = function (id) {
    commentService.addComment(id);
  };

}]);
