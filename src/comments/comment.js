app.factory('Comment', function () {
  return function (spec) {
    spec = spec || {};
    return {
      userId: spec.userId,
      text: spec.text,
      created: Date.now(),
      subjectId: spec.subjectId
    };
  };
});
