const { Genre, validate } = require('../models/genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const genres = await Genre.find().select('-__v')
  return res.json({
    status: 200,
    data: genres
  })
})

router.post('/', [auth, admin], async (req, res) => {
  // validate req
  const { error } = validate(req.body)
  if (error) return res.json({
    status: 400,
    message: error.message
  })
  // check if exists
  const isExist = await Genre.exists({ name: req.body.name })
  if (isExist) return res.json({
    status: 400,
    message: 'Genre already added'
  })  
  // create genre
  try {
    const genre = await Genre.create(req.body)
    return res.json({
      status: 201,
      data: genre
    })
  }
  catch(ex) {
    console.log(ex)
    return res.json({
      status: 400,
      message: ex.message
    })
  }
})

module.exports = router