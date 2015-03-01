app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shares/:id/comments', {
    controller: 'commentsCtrl',
    controllerAs: 'vm',
    templateUrl: 'comments/comments.html',
    resolve: {
      comments: ['commentService', function (commentService) {
        return commentService.getCommentList();
      }]
    }
  });
}])
.controller('commentsCtrl', ['$location', 'commentService', 'comments', 'Comment', function ($location, commentService, comments, Comment) {
  var self = this;

  self.comments = Comment();

  self.getCommentList = function (id) {
    commentService.getCommentList(id);
  };

  self.addComment = function () {
    console.log(self);
    commentService.addComment(self.comments);
  };

}]);
