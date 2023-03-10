const Note = require('../models/note')

const initialNotes = [
    {
        content: "HTML is easy",
        important: true
    },
    {
        content: "Browser can execute only Javascript",
        important: false
    },
    {
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon' })
    await note.save()
    await note.remove()

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

module.exports = {
    initialNotes, nonExistingId, notesInDb
}
