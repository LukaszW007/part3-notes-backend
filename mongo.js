const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const noteContent = process.argv[3] ? process.argv[3] : 'empty Note'
const noteImportance = process.argv[4] ? process.argv[4] : false

const url =
    `mongodb+srv://luwi:${password}@todolist.gdm9f13.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: noteContent,
    important: noteImportance,
})

note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})

// Note.find({important: false}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })
