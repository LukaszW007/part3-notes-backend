const notesRouter = require('express').Router()
const Note = require('../models/note')
const logger = require('../utils/logger')

// notesRouter.get('/', (req, res) => {
//     res.send('<h1>Hello World!</h1>')
// })

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

notesRouter.post('/api/notes', (request, response, next) => {
    const body = request.body

    logger.info('body ',body)

    const note = new Note({
        content: body.content,
        important: body.important,
        date: new Date(),
    })

    // if (!body.content) {
    //   return response.status(400).json({
    //     error: 'content missing'
    //   })
    // }
    // if (!body.important) {
    //     return response.status(400).json({
    //         error: 'important missing'
    //     })
    // }

    Note.create(note)
        .then(savedNote => {
            response.json(savedNote.toJSON())
        })
        .catch(error => next(error))
})

notesRouter.get('/api/notes', (req, res) => {
    Note.find({})
        .then(notes=> {
            res.json(notes);
        })
        .catch(error => next(error))
})

notesRouter.delete('api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(deletedCount => {
            if (deletedCount) {
                logger.info("item with id ",request.params.id," is deleted")
            } else {
                logger.info("item with id ",request.params.id," not found")
            }
            response.status(204).end()
        })
        .catch(error => next(error))
})

notesRouter.get('api/notes/:id', (request, response, next) => {
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


notesRouter.put('api/notes/:id', (request, response, next)=> {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }
    Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
            logger.info("item updated to ",request.body)
        })
        .catch(error => next(error))
})

module.exports = notesRouter
