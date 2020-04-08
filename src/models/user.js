const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Result = require('./result')

const userSchema = new mongoose.Schema({
  uid:{
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age lower than 0')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

userSchema.virtual('results', {
  ref: 'Result',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.tokens

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

userSchema.statics.findByCredentials = async (uid) => {
  const user = await User.findOne({ uid })

  if (!user) {
    throw new Error('no user login fail')
  }

  return user

}

// Hash the plain text password before saving
// userSchema.pre('save', async function (next) {
//   const user = this

//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8)
//   }

//   next()
// })

userSchema.pre('remove', async function (next) {
  const user = this
  await Result.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User