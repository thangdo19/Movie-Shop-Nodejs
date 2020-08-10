const Joi = require('joi')
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    uppercase: true,
    required: true,
    maxlength: 255
  }
})

const Genre = mongoose.model('Genre', genreSchema)

function validate(reqBody) {
  const schema = Joi.object({ name: Joi.string().max(255).required() })
  return schema.validate(reqBody)
}

module.exports = {
  Genre,
  validate,
  genreSchema
}