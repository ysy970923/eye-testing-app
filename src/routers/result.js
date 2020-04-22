const express = require('express')
const Result = require('../models/result')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/results', auth, async (req, res) => {
  const result = new Result({
    ...req.body,
    owner: req.user._id
  })

  try {
    await result.save()
    res.status(201).send(result)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/results', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    // const results = await Result.find({ owner: req.user._id })
    await req.user.populate({
      path: 'results',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.results)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/results/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const result = await Result.findOne({ _id, owner: req.user._id })

    if (!result) {
      return res.status(404).send()
    }

    res.send(result)
  } catch (e) {
    res.status(500).send()
  }
})

router.patch('/results/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'invalid updates' })
  }

  try {
    // const result = await result.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    const result = await Result.findOne({ _id: req.params.id, owner: req.user._id })

    if (!result) {
      return res.status(404).send()
    }
    updates.forEach((update) => result[update] = req.body[update])
    await result.save()
    res.send(result)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/results/:id', auth, async (req, res) => {
  try {
    // const result = await result.findByIdAndDelete(req.params.id)
    const result = await Result.findByIdAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!result) {
      return res.status(404).send()
    }
    res.send(result)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router