const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')
const notesRouter = require('./controllers/notes')

mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
    .then(result => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.info('error connecting to MongoDB:', error.message)
    })


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/', notesRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
////////////////////////////////////////////
// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2022-01-10T17:30:31.098Z",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2022-01-10T18:39:34.091Z",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2022-01-10T19:20:14.298Z",
//     important: true
//   }
// ]
////////////////////////////////////////////
//problems with deploy:full
// --> Verified app config
// ==> Building image
// WARN Failed to start remote builder heartbeat: You hit a Fly API error with request ID: 01GRF3297M6NGQ9AN1AENYBSNW-dfw
// Error failed to fetch an image or build from source: You hit a Fly API error with request ID: 01GRF329PYMMH3M6HNNXRTPDZ1-dfw
//
// to fix it: flyctl version update, flyctl agent restart , and then, npm run deploy:full
