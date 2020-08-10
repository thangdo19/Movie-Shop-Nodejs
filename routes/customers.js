const { Customer, validate } = require('../models/customer')
const auth = require('../middleware/auth')
const employee = require('../middleware/employee')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const customers = await Customer.find().select('-__v')
  return res.status(200).json({
    status: 200,
    data: customers
  })
})

router.post('/', [auth, employee], async (req, res) => {
  // validate req
  const { error } = validate(req.body)
  if (error) {
    return res.status(200).json({
      status: 400,
      message: error.message
    })
  }
  // check if exist
  const isExist = await Customer.exists({ phone: req.body.phone })
  if (isExist) {
    return res.status(200).json({
      status: 400,
      message: 'Customer already exists'
    })
  }
  // create Customer
  try {
    const customer = await Customer.create(req.body)
    return res.status(200).json({
      status: 201,
      data: customer
    })
  }
  catch(ex) {
    return res.status(200).json({
      status: 400,
      message: ex.message
    })
  }
})

module.exports = router