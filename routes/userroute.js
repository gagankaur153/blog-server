const express = require('express')
const { register,login, profile, logout } = require('../controllers/usercontroller')
const { authhandler } = require('../middleware/authtoken')
const router = express.Router()

//REGISTER 
router.post('/register', register)

//LOGIN
router.post('/login',login)

//PROFILE
router.get('/profile',authhandler,profile)

//LOGOUT
router.delete('/logout', authhandler, logout)

module.exports = router