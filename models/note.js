require('dotenv').config()

const mongoose = require('mongoose')
const logger = require('../utils/logger')


const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    date: Date,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)
