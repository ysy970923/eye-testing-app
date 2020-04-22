const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  result1: {
    type: String,
    required: true
  },
  result2: {
    type: String,
    required: true
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