module.exports = function(err, req, res, next) {
  console.log(err)

  return res.json({
    status: 500,
    message: 'An unexpected error occurred'
  })
}
