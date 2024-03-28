const { transcriptAudio } = require("../controllers/transcription");
const express = require("express");
const multer = require('multer'); 
const upload = multer();

const app = express();

app.post("/transcript", upload.single('audio'), transcriptAudio);

module.exports = app;
