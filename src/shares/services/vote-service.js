app.factory('voteService', ['$http', function(http) {
  function post(share) {
    return processAjaxPromise($http.post(share));
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
    upvote: function (share) {
      return post('/api/res/' + id/votes).then(function () {
        return { vote: 1 }
      })
    },

    downvote: function (share) {
      return post('/api/res/' + id/votes).then(function () {
        return { vote: -1 }
      })
    }
  };
}]);
