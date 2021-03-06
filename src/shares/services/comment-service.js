app.factory('commentService', ['$http', '$log', function($http, $log) {
  function post(url, data) {
    return processAjaxPromise($http.post(url, data));
  }

  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function remove(url, comment) {
    return processAjaxPromise($http.delete(url, comment));
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

    getCommentList: function (id) {
      return get('/api/res/' + id + '/comments');
    },

    addComment: function (id, comment) {
      return post('/api/res/' + id + '/comments', { text: comment.text });
    },

    deleteComment: function (comment) {
      return remove('/api/res/' + comment.subjectId + '/comments/' + comment._id);
    }
  };
}]);
