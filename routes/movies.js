const { Movie, validate } = require('../models/movie')
const { Genre } = require('../models/genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const employee = require('../middleware/employee')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const movies = await Movie.find().select('-__v')
  return res.status(200).json({
    status: 200,
    data: movies
  })
})

router.get('/:id', async (req, res) => {
  // validate params id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({
      status: 400,
      message: 'Invalid id'
    })
  }
  // find movie & response
  const movie = await Movie.findById(req.params.id)
  if (!movie) {
    return res.status(200).json({
      status: 404,
      message: 'Movie not found'
    })
  }
  return res.status(200).json({
    status: 200,
    data: movie
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
  // check if exist (genres) & take all genre's info into 'genres'
  const genres = []
  for (let id of req.body.genreIds) {
    const genre = await Genre.findById(id)
    if (!genre) {
      return res.status(200).json({
        status: 400,
        message: `Cannot find genre with id: ${id}, please check again`
      })
    }
    genres.push(genre)
  }
  // create movie & response
  try {
    const movie = await Movie.create({
      title: req.body.title,
      genres,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    })
    return res.status(200).json({
      status: 201,
      data: movie
    })
  }
  catch(ex) {
    return res.status(200).json({
      status: 400,
      message: ex.message
    })
  }
})

router.put('/:id', [auth, employee], async (req, res) => {
  // validate request
  const { error } = validate(req.body)
  if (error) {
    return res.status(200).json({
      status: 400,
      message: error.message
    })
  }
  // validate params id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({
      status: 400,
      message: 'Invalid id'
    })
  }
  // check if exist (genres) & take all genre's info into 'genres'
  const genres = []
  for (let id of req.body.genreIds) {
    const genre = await Genre.findById(id)
    if (!genre) {
      return res.status(200).json({
        status: 400,
        message: `Cannot find genre with id: ${id}, please check again`
      })
    }
    genres.push(genre)
  }
  // update
  try {
    const result = await Movie.updateOne(
      { _id: req.params.id }, 
      { $set: genres, $set: req.body }, 
      { new: true, runValidators: true }
    )
    // case cannot find that movie
    if (result.n === 0) {
      return res.status(200).json({
        status: 400,
        message: "Movie not found"
      })
    }
    // case nothing changes
    if (result.nModified === 0) {
      return res.status(200).json({
        status: 400,
        message: "Nothing changes"
      })
    }
    // update OK
    return res.status(200).json({
      status: 200
    })
  }
  catch(ex) {
    return res.status(200).json({
      status: 400,
      message: ex.message
    })
    
  }
})

router.patch('/:id', [auth, employee], async (req, res) => {
  // validate params id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({
      status: 400,
      message: 'Invalid id'
    })
  }
  // check if exist (genres) & take all genre's info into 'genres'
  if (req.body.genreIds) {
    const genres = []
    for (let id of req.body.genreIds) {
      const genre = await Genre.findById(id)
      if (!genre) {
        return res.status(200).json({
          status: 400,
          message: `Cannot find genre with id: ${id}, please check again`
        })
      }
      genres.push(genre)
    }
    // set req.boy
    req.body.genres = genres
  }
  // update
  try {
    const result = await Movie.updateOne(
      { _id: req.params.id }, 
      { $set: req.body }, 
      { new: true, runValidators: true }
    )
    // case cannot find that movie
    if (result.n === 0) {
      return res.status(200).json({
        status: 400,
        message: "Movie not found"
      })
    }
    // case nothing changes
    if (result.nModified === 0) {
      return res.status(200).json({
        status: 400,
        message: "Nothing changes"
      })
    }
    // update OK
    return res.status(200).json({
      status: 200
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