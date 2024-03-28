const express = require("express");
const cors = require("cors");

process.env.GOOGLE_APPLICATION_CREDENTIALS='academicsoftware.json'

const app = express();
//middlewares
app.use(cors());
app.use(express.json());


//configuraciones
app.set("port","8081");

//rutas
app.use("/storytelling",require("./routes/transcription"));


app.listen(app.get("port"), ()=>{
    console.log("backend escuchando en el puerto "+app.get("port"));
})