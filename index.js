const express = require('express')
const app = express()
// handle uncaughtException & unhandledRejection & config
require('./startup/error')()
require('./startup/config')()
// connect db & setup validation
require('./startup/db')()
require('./startup/validation')()
// routes & middleware
require('./startup/routes')(app)
// port & listen
app.listen(port = (process.env.PORT || 3000), () => console.log(`Listening on port ${port}...`))