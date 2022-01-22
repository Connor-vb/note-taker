const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uniqid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());




app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect("index.html");
})

app.get('/notes', (req, res) => {
    res.redirect("notes.html");
})

app.get('/api/notes', (req, res) => {

    const db = fs.readFileSync('./db/db.json', 'utf-8');
    const notes = JSON.parse(db || [])
    
    res.json(notes);
});



app.post('/api/notes', (req, res) => {
    const title = req.body.title;
    const text = req.body.text;
    if (title, text) {
        const newNote = {
            title,
            text,
            id: uuid()
        };
        const response = {
            status: 'success',
            body: newNote,
        };
    
        try {
            const notes = fs.readFileSync('./db/db.json', 'utf-8');
            const jsonNotes = JSON.parse(notes);

            jsonNotes.push(newNote); 
            fs.writeFileSync('./db/db.json', JSON.stringify(jsonNotes));

        }
        catch (error) {
            res.json(error);
        }
    
        res.json(response)

    }

    else {
        res.json(`Error in adding note!`)
    }

})


app.delete('/api/notes/:id', (req, res) => {
    
    const db = fs.readFileSync('./db/db.json', 'utf-8');
    const jsonNotes = JSON.parse(db);
    
    jsonNotes.forEach((note) => {
        if (note.id === req.params.id) {
            jsonNotes.splice(jsonNotes.indexOf(note),1);
            fs.writeFileSync('./db/db.json', JSON.stringify(jsonNotes));

            res.json("OK!");
        }
    })
})



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});