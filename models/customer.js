const Joi = require('joi')
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
  },
  phone: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 9,
    unique: true
  },
  isGold: {
    type: Boolean,
    default: false,
  }
})

const Customer = mongoose.model('Customer', customerSchema)

function validate(reqBody) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    phone: Joi.string().min(6).max(9).required(),
    isGold: Joi.boolean()
  })
  return schema.validate(reqBody)
}

module.exports = {
  Customer,
  validate,
  customerSchema
}