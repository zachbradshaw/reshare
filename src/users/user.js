app.factory('User', function () {
  return function (spec) {
    spec = spec || {};
    return {
      userId: spec.userId || '',
      userPic: spec.userPic || '',
      userNum: spec.userNum || '',
      role: spec.role || 'user'
    };
  };
});
