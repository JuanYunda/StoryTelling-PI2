const {transcriptAudio} = require("../controllers/transcription");
const express = require("express");
const app = express();


app.post("/transcript", transcriptAudio);

module.exports = app;