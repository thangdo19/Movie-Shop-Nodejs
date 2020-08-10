const { ROLE } = require('../data')

module.exports = function(req, res, next) {
  if (ROLE[req.user.role] < ROLE.ADMIN) return res.json({
    status: 403,
    message: 'Access denied'
  })
  next()
}