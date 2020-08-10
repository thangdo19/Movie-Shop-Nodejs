require('express-async-errors')
require('dotenv').config()
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const morgan = require('morgan')
const express = require('express')
const app = express()
// requires routes
const auth = require('./routes/auth')
const users = require('./routes/users')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const error = require('./middleware/error')
// connect db
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log('Connected to MongoDB...'))
// handle uncaughtException & unhandleRejection
process.on('uncaughtException', (ex) => {
  console.log(ex)
  process.exit(1)
})
process.on('unhandledRejection', (ex) => {
  throw ex
})
app.use(express.json())
app.use(morgan('dev'))
// routes
app.use('/api/auth', auth)
app.use('/api/users', users)
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use(error)
// port & listen
app.listen(port = (process.env.PORT || 3000), () => console.log(`Listening on port ${port}...`))