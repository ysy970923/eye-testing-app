const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  result1: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

const Result = mongoose.model('Result', resultSchema)

module.exports = Result