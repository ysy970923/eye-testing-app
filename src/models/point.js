const mongoose = require('mongoose')

const pointSchema = new mongoose.Schema({
  point: {
    type: Number,
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

const Point = mongoose.model('Point', pointSchema)

module.exports = Point