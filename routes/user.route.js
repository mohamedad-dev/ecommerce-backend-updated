const { Router } = require('express')
const User = require('../models/user')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mohamedamine.dammak98@gmail.com',
    pass: 'ovrz tvuf ydze ljur',
  },
  tls: {
    rejectUnauthorized: false,
  },
})

const userRouter = Router()

userRouter.get('/', async (req, res) => {
  try {
    // yraja3hom maghir el password
    const users = await User.find().select('-password')
    res.status(200).json(users)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

userRouter.post('/register', async (request, response) => {
  try {
    const { email, password, firstname, lastname } = request.body

    // find 1st occurance
    const user = await User.findOne({ email })
    if (user) {
      return response
        .status(400)
        .send({ success: false, message: 'email already exists' })
    }

    const newUser = new User({ email, password, firstname, lastname })
    const createdUser = await newUser.save()

    //
    // Envoyer l'e-mail de confirmation de l'inscription
    var mailOption = {
      from: '"verify your email " <esps421@gmail.com>',
      to: newUser.email,
      subject: 'vérification your email ',
      html: `<h2>${newUser.firstname}! thank you for registreting on our website</h2>
            <h4>please verify your email to procced.. </h4>
            <a href="http://${request.headers.host}/api/users/status/edit?email=${newUser.email}">click here</a>`,
    }
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('verification email sent to your gmail account ')
      }
    })
    return response.status(201).send({
      success: true,
      message: 'Account created successfully',
      user: createdUser,
    })
  } catch (error) {
    response.status(400).send({ success: false, message: error.message })
  }
})

userRouter.get('/status/edit/', async (req, res) => {
  try {
    let email = req.query.email
    let user = await User.findOne({ email })
    user.isActive = !user.isActive
    await user.save()
    res.status(200).send({ success: true, user })
  } catch (err) {
    return res.status(404).send({ success: false, message: err })
  }
})

userRouter.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: 'All fields are required' })
    }
    let user = await User.findOne({ email })
    //   .select('+password')
    //   .select('+isActive')
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Account doesn't exists" })
    } else {
      let isCorrectPassword = await bcrypt.compare(password, user.password)
      if (isCorrectPassword) {
        // nehi el password mel reseau
        delete user._doc.password
        if (!user.isActive) {
          return res.status(200).send({
            success: false,
            message:
              'Your account is inactive, Please contact your administrator',
          })
        }
        const token = jwt.sign(
          { iduser: user._id, name: user.firstname, role: user.role },
          process.env.SECRET,
          {
            expiresIn: '1h',
          }
        )
        return res.status(200).send({ success: true, user, token })
      } else {
        return res
          .status(400)
          .send({ success: false, message: 'Please verify your credentials' })
      }
    }
  } catch (err) {
    // console.log(err)

    return res.status(404).send({ success: false, message: err.message })
  }
})

userRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    await User.findByIdAndDelete(id)
    res.status(200).json({ message: 'user deleted successfully' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

module.exports = userRouter
