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

notesRouter.post('/api/notes', async (request, response, next) => {
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

    const savedNote = await Note.create(note)
    response.status(201).json(savedNote.toJSON())
    // response.json(savedNote.toJSON())
})

notesRouter.get('/api/notes', async (req, res) => {
    const notes = await Note.find({})
    res.status(200).json(notes)
})

notesRouter.delete('/api/notes/:id', async (request, response, next) => {
    const deletedCount = await Note.findByIdAndRemove(request.params.id)
    if (deletedCount) {
        logger.info("item with id ",request.params.id," is deleted")
    } else {
        logger.info("item with id ",request.params.id," not found")
    }
    response.status(204).end()
})

notesRouter.get('/api/notes/:id', async (request, response, next) => {
    logger.info('NOTErequest.params.id:',request.params)
    const note = await Note.findById(request.params.id)
    logger.info('NOTE:',note)

    if (note) {
        response.status(200).json(note)
    } else {
        response.status(404).end()
    }
})


notesRouter.put('/api/notes/:id', async (request, response, next)=> {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }
    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: 'query' })
    response.status(201).json(updatedNote)
    logger.info("item updated to ",request.body)
})

module.exports = notesRouter
