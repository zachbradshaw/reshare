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
