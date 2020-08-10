const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  if (!req.header('x-auth-token')) return res.json({
    status: 401,
    message: 'Access denied. No token provided'
  })
  try {
    const decoded = jwt.verify(req.header('x-auth-token'), process.env.JWT_KEY)
    req.user = decoded
    next()
  }
  catch(ex) {
    return res.json({
      status: 400,
      message: 'Invalid token'
    })
  }
}