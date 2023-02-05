const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
const Note = require('./models/note')


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

//problems with deploy:full
// --> Verified app config
// ==> Building image
// WARN Failed to start remote builder heartbeat: You hit a Fly API error with request ID: 01GRF3297M6NGQ9AN1AENYBSNW-dfw
// Error failed to fetch an image or build from source: You hit a Fly API error with request ID: 01GRF329PYMMH3M6HNNXRTPDZ1-dfw
//
// to fix it: flyctl version update, flyctl agent restart , and then, npm run deploy:full
