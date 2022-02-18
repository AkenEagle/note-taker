const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route for notes application
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/notes.html"));
});

// Get saved notes
app.get("/api/notes", (req, res) => {
  // Read the db.json
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    // Send the data as JSON object
    res.send(JSON.parse(data));
  });
});

// New note
app.post("/api/notes", (req, res) => {
  // Get the user note
  const userNote = { id: uuidv4(), title: req.body.title, text: req.body.text };

  // Read the db.json
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    // Parse to JSON
    let notes = JSON.parse(data);
    // Push the user note
    notes.push(userNote);
    // Write to db.json the new notes
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.log(error);
        return;
      }
    });
    // Send the new note to client
    res.send(userNote);
  });
});

// Delete a note by ID
app.delete("/api/notes/:id", (req, res) => {
  // Get the ID of the note to delete
  const noteID = req.params.id;

  // Read from db.json
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    // Get the notes from the file in JSON
    const notes = JSON.parse(data);

    // Delete the note with that ID in a new array
    const newNotes = notes.filter((note) => note.id !== noteID);

    // Write the new notes in db.json
    fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err) => {
      if (err) {
        console.log(error);
        return;
      }
    });

    // Send
    res.send(newNotes);
  });
});

// Route for index file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
