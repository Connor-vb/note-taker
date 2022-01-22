const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();



app.use(express.json());
app.use(express.urlencoded({extended: true}));
//serves all public files from express server
app.use(express.static(path.join(__dirname, 'public')));

// display the index.html webpage
app.get('/', (req, res) => {
    res.redirect("index.html");
})

//display notes.html webpage
app.get('/notes', (req, res) => {
    res.redirect("notes.html");
})

//`GET /api/notes` should read the `db.json` file 
// and return all saved notes as JSON.
//without the await method, readFromFile never finishes its process
app.get('/api/notes', (req, res) => {
    console.log(`${req.method} METHOD received to grab all notes!`);
    const db = fs.readFileSync('./db/db.json', 'utf-8');
//either turn the notes database into an object or return empty list
//note: empty list is used to store every note that is represented as an object
    const notes = JSON.parse(db || [])
    res.json(notes);
});

// `POST /api/notes` should receive a new note to save on the request body, 
// add it to the `db.json` file, 
// and then return the new note to the client. 


app.post('/api/notes', (req, res) => {
    const title = req.body.title;
    const text = req.body.text;
    // if user has typed in something in title and text, create a note with random id and add to the webpage
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
    
        // take the original notes database by reading existing notes from it
        // turn it into an object to parse data to it
        // take the newNote we created and push it into jsonNotes
        // write the notes database we created into db.json
        try {
            const notes = fs.readFileSync('./db/db.json', 'utf-8');
            // turns notes from JSON string to javascript object
            const jsonNotes = JSON.parse(notes);
            jsonNotes.push(newNote); 
            // reconvert jsonNotes to string that gets added to db.json database
            fs.writeFileSync('./db/db.json', JSON.stringify(jsonNotes));

        }
        catch (error) {
            
            console.log(`${error} has been found!`);
            res.json(error);
        }
    // if we run into error, response will not be called
        res.json(response)

    }

    else {
        res.json(`Error in adding note!`)
    }

})

//URL to delete a note from database (using: `DELETE /api/notes/:id` )
//read data from db.json file, use a foreach to iterate through each note
//if the id we find matches the id we want to delete, remove from database using splice
//and rewrite the new notes database to db.json file
app.delete('/api/notes/:id', (req, res) => {
    
    const db = fs.readFileSync('./db/db.json', 'utf-8');
    const jsonNotes = JSON.parse(db);
    jsonNotes.forEach((note) => {
        if (note.id === req.params.id) {
            jsonNotes.splice(jsonNotes.indexOf(note),1);
            fs.writeFileSync('./db/db.json', JSON.stringify(jsonNotes));
//return a response when note has been deleted from the database
            res.json("OK!");
        }
    })
})



app.listen(3001, () => {
    console.log('Listening on port 3001!');
});