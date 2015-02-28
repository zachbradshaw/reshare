app.factory('Comment', function () {
  return function (spec) {
    spec = spec || {};
    return {
      userId: spec.userId,
      content: spec.content,
      created: new Date.now()
    };
  };
});
