var role = {
  ADMIN: 'admin',
  USER: 'user'
};

// used to check if a user has at least a certain level of permission
var roleWeight = {
  admin: 1,
  user: 0
};

// determines whether the specified user has the specified role
function isInRole (role, user) {
  return user && (roleWeight[user.role] || 0) >= roleWeight[role];
}

// restrictedHandler creates an express route that
// first checks to see if the user is in a specified role
function isInRole (role) {
  return function (req, res, next) {
    function confirmRole() {
      var currentUser = req.user;

      if (!isInRole(role, currentUser)) {
        res.status(403).json({ message: 'Unauthorized' });
      } else {
        next();
      }
    }

    isAuthenticated(req, res, confirmRole);
  }
}

function isAuthenticated (req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'Login required' });
  }
}

module.exports = {
  role: role,
  isInRole: isInRole,
  isAuthenticated: isAuthenticated
};
