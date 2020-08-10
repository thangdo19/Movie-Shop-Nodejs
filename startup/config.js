require('express-async-errors')
require('dotenv').config()

module.exports = function() {
  if (!process.env.JWT_KEY) {
    console.log('FATAL ERROR: JWT_KEY is not provided')
    process.exit(1)
  }
}