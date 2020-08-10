const { User, validate, validatePatch } = require('../models/user')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const users = await User.find().select('-__v -password')
  return res.json({
    status: 200,
    data: users
  })
})

router.get('/me', [auth], async (req, res) => {
  const current = await User.findById(req.user._id).select('-__v -password')
  return res.json({
    status: 200,
    data: current
  })
})

router.get('/:id', async (req, res) => {
  // validate id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.json({
    status: 400,
    message: 'Invalid id'
  })
  // find
  const user = await User.findById(req.params.id).select('-__v -password')
  if (!user) return res.json({
    status: 404,
    message: 'User not found'
  })
  // response
  return res.json({
    status: 200,
    data: user
  })
})

router.post('/', async (req, res) => {
  // validate req
  const { error } = validate(req.body)
  if (error) return res.json({
    status: 400,
    message: error.message
  })
  // check if exists
  const isExist = await User.exists({ email: req.body.email })
  if (isExist) return res.json({
    status: 400,
    message: 'User already registered'
  })
  // create user
  let user = req.body
  user.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
  user = await User.create(user)
  // generate token & response
  const token = jwt.sign(_.pick(user, ['_id', 'role']), process.env.JWT_KEY)
  return res.json({
    status: 201,
    data: _.pick(user, ['_id', 'name', 'email', 'role']),
    token
  })
})

router.put('/:id', [auth, admin], async (req, res) => {
  // validate req
  const { error } = validate(req.body)
  if (error) return res.json({
    status: 400,
    message: error.message
  })
  // take info & hash password
  const newUserInfo = _.omit(req.body, ['email'])
  newUserInfo.password = await bcrypt.hash(newUserInfo.password, await bcrypt.genSalt(10))
  // validate id, find & update Doc
  await updateDoc(req, res, newUserInfo)
  // response if no err occurs
  return res.json({
    status: 200
  })
})

router.patch('/:id', [auth, admin], async (req, res) => {
  // validate req
  const { error } = validatePatch(req.body)
  if (error) return res.json({
    status: 400,
    message: error.message
  })
  // handle info
  const newUserInfo = req.body
  if (newUserInfo.password) {
    // hash
    newUserInfo.password = await bcrypt.hash(newUserInfo.password, await bcrypt.genSalt(10))
  }
  // update doc
  await updateDoc(req, res, newUserInfo)
  return res.json({
    status: 200
  })
})

router.delete('/:id', [auth, admin], async (req, res) => {
  // check if user exists
  const checkResult = await checkUserExist(req, res)
  if (checkResult instanceof Error) return res.json({
    status: 400,
    message: checkResult.message
  })
  // delete user
  const result = await User.deleteOne({ _id: req.params.id })
  // somehow db not affected
  if (result.deletedCount === 0) {
    return res.status(200).json({
      status: 400,
      message: "Cannot delete user"
    })
  }
  // works fine
  return res.json({
    status: 200
  })
})

// looking for user & return Error if fail, 'true' if exists
async function checkUserExist(req, res) {
  // validate id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return new Error('Invalid id')
  // find user
  const isExist = await User.exists({ _id: req.params.id})
  if (!isExist) return new Error('User not found')
  // found
  return isExist
}

// support func for update (PUT|PATCH)
async function updateDoc(req, res, newUserInfo) {
  // check if user exists
  const checkResult = await checkUserExist(req, res)
  if (checkResult instanceof Error) return res.json({
    status: 400,
    message: checkResult.message
  })
  // update doc
  try {
    const result = await User.updateOne({ _id: req.params.id }, newUserInfo, {
      runValidators: true
    })
    console.log(result)
  }
  catch(ex) {
    console.log(ex)
    return res.json({
      status: 400,
      message: ex.message
    })
  }
}

module.exports = router