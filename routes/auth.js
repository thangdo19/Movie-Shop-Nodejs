const { User } = require('../models/user')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  // validate req
  const { error } = validate(req.body)
  if (error) return res.json({
    status: 400,
    message: error.message
  })
  // find
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.json({
    status: 400,
    message: 'Invalid email or password'
  })
  // compare
  const isEqual = await bcrypt.compare(req.body.password, user.password)
  if (!isEqual) return res.json({
    status: 400,
    message: 'Invalid email or password'
  })
  // generate token & response
  const token = jwt.sign(_.pick(user, ['_id', 'role']), process.env.JWT_KEY)
  return res.json({
    status: 200,
    token
  })
})

function validate(reqBody) {
  const schema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(5).max(1024).required(),
  })
  return schema.validate(reqBody)
}

module.exports = router