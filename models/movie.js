const { genreSchema } = require('../models/genre')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 255
  },
  genres: {
    type: [genreSchema],
    required: true
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0
  }
})

const Movie = mongoose.model('Movie', movieSchema)

function validate(reqBody) {
  const schema = Joi.object({
    title: Joi.string().max(255).required(),
    genreIds: Joi.array().items(Joi.objectId().max(255)).required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0)
  })
  return schema.validate(reqBody)
}

module.exports = {
  Movie,
  validate,
  movieSchema
}
