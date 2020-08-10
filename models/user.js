const Joi = require('joi')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  role: {
    type: String,
    enum: ['ADMIN', 'EMPLOYEE', 'BASIC'],
    default: 'BASIC',
    uppercase: true
  }
})

const User = mongoose.model('User', userSchema)

function validate(reqBody) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(5).max(1024).required(),
    role: Joi.string()
  })
  return schema.validate(reqBody)
}

function validatePatch(reqBody) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    password: Joi.string().min(5).max(1024),
    role: Joi.string()
  })
  return schema.validate(reqBody)
}

module.exports = {
  User,
  validate,
  validatePatch
}