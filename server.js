const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = 3000;

// Route for index file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Route for notes application
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Get saved notes
app.get("/api/notes", (req, res) => {
  const data = require("./db/db.json");
  res.json(data);
});

// New note
app.post("/api/notes", (req, res) => {
  const noteId = uuidv4();
  console.log(req.body);
  const noteTitle = req.body.title;
  const noteText = req.body.text;

  const userNote = { id: noteId, title: noteTitle, text: noteText };

  // Add note to db.json
  fs.appendFileSync("./db/db.json", userNote);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
