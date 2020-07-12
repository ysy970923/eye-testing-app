const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const resultRouter = require('./routers/result')
const pointRouter = require('./routers/point')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(resultRouter)
app.use(pointRouter)

app.listen(port, () => {
  console.log('Server is up on port', port)
})