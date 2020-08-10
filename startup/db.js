const mongoose = require('mongoose')
module.exports = function() {
  mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log('Connected to MongoDB...'))
}