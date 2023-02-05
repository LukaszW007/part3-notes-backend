require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
const mongoose = require('mongoose')

// const Note = require('./models/note')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = mongoose.model('Note', noteSchema)

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

app.use(express.json())
app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes=> {
      res.json(notes);
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
}) ///do sprawdzenia lokalnie, pewnie zmiany w put, delete i get po id

app.put('/api/notes/:id', (request, response)=> {
    const id = request.params.id;
    const note = notes.find(note=> note.id == id);

    if (note) {
        const noteIndex = notes.indexOf(note);
        console.log('REQUEST ', request.body)
        notes[noteIndex] = request.body;
        response.json(notes[noteIndex]);
    } else {
        response.send('<h1 id="text">There is no any note with id</h1>');
        response.status(404).end();
    }

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
