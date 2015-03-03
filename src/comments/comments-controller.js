app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shares/:id/comments', {
    controller: 'commentsCtrl',
    controllerAs: 'vm',
    templateUrl: 'comments/comments.html',
    resolve: {
      share: ['$route', 'shareService', function ($route, shareService) {
        return shareService.getShare($route.current.params.id);
      }],
      comments: ['$route', 'commentService', function ($route, commentService) {
        return commentService.getCommentList($route.current.params.id);
      }]
    }
  });
}])
.controller('commentsCtrl', ['share', 'Comment', 'comments', 'commentService', function (share, Comment, comments, commentService) {
  var self = this;

  self.comments = comments;
  self.share = share;
  self.comment = Comment();

  self.addComment = function () {
    console.log(self);
    commentService.addComment(self.share._id, self.comment).then(function (comment) {
      self.comments.push(comment);
      self.comment.text = '';
    });
  };

  self.getCommentList = function () {
    commentService.getCommentList(self.share._id)
  };

  self.deleteComment = function (comment) {
    commentService.deleteComment(comment).then(function () {
      return self.comments;
    });
  };

}]);
