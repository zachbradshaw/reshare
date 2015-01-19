// promiseResponse is a convenience function that handles
// NEDB/mongo errors in a standard way
module.exports = function promiseResponse(promise, res) {
  promise.then(function (result) {
    res.json(result || {});
  }).catch(function (err) {
    res.status(500).json(err);
  })
};
