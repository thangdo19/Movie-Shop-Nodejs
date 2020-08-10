const { Customer, customerSchema } = require('./customer')
const { Movie, movieSchema } = require('./movie')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')

const rentalSchema = new mongoose.Schema({
  rentalFee: {
    type: Number,
    required: true,
    min: 0
  },
  dateOut: {
    type: Date,
    default: Date.now
  },
  dateReturned: Date,
  customer: {
    type: customerSchema,
    required: true
  },
  movie: {
    type: movieSchema,
    required: true
  }
})

const Rental = mongoose.model('Rental', rentalSchema)

function validate(reqBody) {
  const schema = Joi.object({
    rentalFee: Joi.number().min(0).required(),
    dateOut: Joi.date(),
    dateReturned: Joi.date(),
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  })

  return schema.validate(reqBody)
}

module.exports = {
  Rental,
  validate
}