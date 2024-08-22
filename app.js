// lehi bel routes
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
// bech yconnectili 3al database (nosql)
const mongoose = require('mongoose')

const categorieRouter = require('./routes/categorie.route')
const scategorieRouter = require('./routes/scategorie.route')
const articleRouter = require('./routes/article.route')
const paymentRouter = require('./routes/payment.route.js')
// auth
const userRouter = require('./routes/user.route.js')

const app = express()
dotenv.config()
// middleware
app.use(express.json())
app.use(
  cors({
    origin: '*',
  })
)

mongoose
  .connect(process.env.DATABASECLOUD)
  .then(() => {
    console.log('DataBase Successfully Connected')
  })
  .catch((err) => {
    console.log('Unable to connect to database', err)
    process.exit()
  })

app.use('/api/categories', categorieRouter)
app.use('/api/scategories', scategorieRouter)
app.use('/api/articles', articleRouter)
app.use('/api/payment', paymentRouter)
// auth
app.use('/api/users', userRouter)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Application running on ${PORT}`)
  console.log(`http://localhost:${PORT}/`)
})

module.exports = app
