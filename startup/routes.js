const morgan = require('morgan')
const express = require('express')
// requires routes
const auth = require('../routes/auth')
const users = require('../routes/users')
const genres = require('../routes/genres')
const customers = require('../routes/customers')
const movies = require('../routes/movies')
const rentals = require('../routes/rentals')
// middleware
const error = require('../middleware/error')

module.exports = function(app) {
  // middleware
  app.use(express.json())
  app.use(morgan('dev'))
  // routes
  app.use('/api/auth', auth)
  app.use('/api/users', users)
  app.use('/api/genres', genres)
  app.use('/api/customers', customers)
  app.use('/api/movies', movies)
  app.use('/api/rentals', rentals)
  // express
  // route's error handler
  app.use(error)
}