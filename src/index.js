const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Result = require('./models/result')
const userRouter = require('./routers/user')
const resultRouter = require('./routers/result')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(resultRouter)

app.listen(port, () => {
  console.log('Server is up on port', port)
})