var express = require('express')
var router = express.Router()
var passport = require('passport')
var bcrypt = require('bcrypt')

var jwt = require('jsonwebtoken')
var keys = require('../../config/keys')

// Models
const User = require('../models/User')

/*
* Sign up
*/
router.post('/signup', (req, res, next) => {
  const { email, password } = req.body

  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Missing email'
    })
  }

  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Missing password'
    })
  }
  User.findOne({
    where: {
      email: email
    }
  }).then(user => { // then get the user (which sequelize sends)
    if (user) { // if user is null or undefined (will send null if your query matches nothing)
      throw new Error('Email address is already taken') // throw an error within the scope of the
      // sequelize promise (goes to line 49)
    } else {
      const newUser = new User() // otherwise create a new user, same as your old code
      newUser.email = email
      newUser.password = password
      newUser.save()
        .then(res.json({ newUser, message: 'Account Created Successfully' }))
    }
  }).catch(err => { // catch all errors thrown witihn the scope of the findOne call
    res.send({
      success: false,
      message: `Error: ${err.message}` // print the error message
    })
  })
})

/*
* Login
*/
router.post('/login', async function (req, res, next) {
  const { email, password } = req.body

  User.findOne({ email }).then(user => {
  // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: 'Email not found' })
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (email && isMatch) {
        const payload = { id: user.id }
        const token = jwt.sign(payload, keys.secretOrKey)
        res.status(401).json({ message: 'ok', token: token })
      } else {
        res.status(401).json({ msg: 'Incorrect Password' })
      }
    })
  })
})

/*
* Verify
*/
router.get('/verify', passport.authenticate('jwt', { session: false }), function (req, res) {
  res.json({ msg: 'Authorized User' })
})

/*
* Logout
*/
// router.get('/logout', (req, res, next) => {

// })

module.exports = router
