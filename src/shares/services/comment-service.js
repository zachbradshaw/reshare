app.factory('commentService', ['$http', function($http) {
  function post(url, data) {
    return processAjaxPromise($http.post(url, data));
  }

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

    getCommentList: function (id) {
      return get('/api/res/' + id + '/comments');
    },

    addComment: function (id) {
      alert('added comment');
      return post('/api/res/' + id + '/comments', { text: 'text' });
    }
  };
}]);
