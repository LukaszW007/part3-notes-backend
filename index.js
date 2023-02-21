const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
const Note = require('./models/note')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}


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

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

  // if (!body.content) {
  //   return response.status(400).json({
  //     error: 'content missing'
  //   })
  // }
  if (!body.important) {
    return response.status(400).json({
      error: 'important missing'
    })
  }

  Note.create(body)
      .then(savedNote => {
          response.json(savedNote.toJSON())
      })
      .catch(error => next(error))
})

app.get('/api/notes', (req, res) => {
  Note.find({})
      .then(notes=> {
          res.json(notes);
      })
      .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(deletedCount => {
            if (deletedCount) {
                console.log("item with id ",request.params.id," is deleted")
            } else {
                console.log("item with id ",request.params.id," not found")
            }
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.put('/api/notes/:id', (request, response, next)=> {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }
    Note.findByIdAndUpdate(request.params.id, note)
        .then(updatedNote => {
            response.json(updatedNote)
            console.log("item updated to ",request.body)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    // console.error('ERROR',error)
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400)
            .send({ type: error.type,
                    error: error.message
            })
    } else if (error.name === 'ValidationError') {
        return response.status(400)
            .send({ type: error.type,
                    error: error.message
            })
    } else if (error.name === 'SyntaxError') {
        return response.status(400)
            .send({ type: error.type,
                    error: error.message
            })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


////////////////////////////////////////////
//problems with deploy:full
// --> Verified app config
// ==> Building image
// WARN Failed to start remote builder heartbeat: You hit a Fly API error with request ID: 01GRF3297M6NGQ9AN1AENYBSNW-dfw
// Error failed to fetch an image or build from source: You hit a Fly API error with request ID: 01GRF329PYMMH3M6HNNXRTPDZ1-dfw
//
// to fix it: flyctl version update, flyctl agent restart , and then, npm run deploy:full
