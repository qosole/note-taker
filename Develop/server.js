const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));


// Main page 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});


// API routes
// Saving notes to db.json
app.post('/api/notes', (req, res) => {
    console.log(`${req.method} request received for /api/notes`);
    let savedData = [];
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        }
        
        savedData = JSON.parse(data);
        savedData.push(req.body);
        console.log(savedData);

        fs.writeFile('./db/db.json', JSON.stringify(savedData), err => {
            err ? console.log(err) : console.log('Successfully written');
        });
    });
    // Refreshing the page so that the note will appear in the left column and the fields will be cleared
    res.redirect('back'); 
});

// Getting saved notes
app.get('/api/notes', (req, res) => {
    console.log(`${req.method} request received for /api/notes`);
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        }

        res.json(JSON.parse(data));
    })
});



// Homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
