const { Rental, validate } = require('../models/rental')
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movie')
const auth = require('../middleware/auth')
const employee = require('../middleware/employee')
const _ = require('lodash')
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

router.get('/', [auth, employee], async (req, res) => {
  const rentals = await Rental.find().select('-__v')
  return res.status(200).json({
    status: 200,
    data: rentals
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
  // looking for customer & movie
  const movieDoc = await Movie.findById(req.body.movieId)
  const customerDoc = await Customer.findById(req.body.customerId)
  if (!movieDoc || !customerDoc) {
    return res.status(200).json({
      status: 400,
      message: 'Movie or Customer not found'
    })
  }
  if (movieDoc.numberInStock === 0) {
    return res.status(200).json({
      status: 400,
      message: 'Movie out of stock'
    })
  }
  // filter movie & customer
  const movie = _.pick(movieDoc, ['_id', 'title', 'genres'])
  const customer = _.pick(customerDoc, ['_id', 'name', 'phone', 'isGold'])
  // check if exists
  const rentalCheck = await Rental.findOne({ movie: movie, customer: customer })
  if (rentalCheck) {
    if (!rentalCheck.dateReturned) {
      return res.status(200).json({
        status: 400,
        message: 'Already have this rental and not returned yet'
      })
    }
  }
  // create rental (WARNING: NO TRANSACTION)
  try {
    const rental = await Rental.create({
      rentalFee: req.body.rentalFee,
      dateOut: req.body.dateOut,
      dateReturned: req.body.dateReturned,
      movie,
      customer
    })
    await Movie.updateOne({ _id: movie._id }, {
      $inc: { numberInStock: -1 }
    })
    return res.status(200).json({
      status: 201,
      data: rental
    })
  }
  catch(ex) {
    return res.status(200).json({
      status: 400,
      message: ex.message
    })
  }
})

router.delete('/:id', [auth, employee], async (req, res) => {
  // validate id
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({
      status: 400,
      message: 'Invalid id'
    })
  }
  // delete
  const result = await Rental.remove({ _id: req.params.id })
  // not found
  if (result.n === 0) {
    return res.status(200).json({
      status: 400,
      message: 'Rental not found'
    })
  }
  // no rental was deleted
  if (result.deletedCount === 0) {
    return res.status(200).json({
      status: 400,
      message: 'Cannot delete rental'
    })
  }
  // OK
  return res.status(200).json({
    status: 200
  })
})

module.exports = router