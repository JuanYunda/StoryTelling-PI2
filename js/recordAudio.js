import { GoogleGenerativeAI } from "@google/generative-ai";
const recordButton = document.getElementById('recordButton');
const continueButton = document.getElementById('continueButton');
const textArea = document.getElementById('textArea');
const microphoneIcon = document.getElementById('microphone');
const stopIcon = document.getElementById('stop');
const continueText = document.getElementById('continue');
const restartText = document.getElementById('restart');

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let completed = false;


const genAI = new GoogleGenerativeAI("AIzaSyDOf0NoumfYp7JH53zpsl6TtDgg-E-j3nY");

const cuentoInicial = `En el corazón del bosque encantado, vivía una pequeña ardilla llamada Nuka, famosa por su pelaje rojizo y su astucia. Un día, mientras recolectaba nueces para el invierno, Nuka se encontró con un pequeño polluelo que había caído de su nido. El polluelo, asustado y sin poder volar, piaba desconsoladamente.

Nuka, con su corazón bondadoso, no pudo dejar al polluelo a su suerte. Decidió ayudarlo a regresar a su nido, ubicado en lo alto de un árbol frondoso. Nuka trepó con cuidado, esquivando ramas y sorteando obstáculos, con el polluelo a salvo en su pelaje.

Sin embargo, al llegar al nido, Nuka se encontró con un problema: era demasiado alto para alcanzarlo sin ayuda. Desesperada, miró a su alrededor buscando una solución. De pronto, vio una bandada de gorriones que revoloteaban cerca. Nuka ideó un plan.`; 

//textArea.value = cuentoInicial

recordButton.addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

async function history() {
    console.log(textArea.value);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = "Agrega cuatro renglones a la historia" + textArea.value;
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }

continueButton.addEventListener('click', () => {
    history();
});

function startRecording() {
    audioChunks = [];

    stopIcon.style.display = "block";
    microphoneIcon.style.display = "none";
    isRecording = true;

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                microphoneIcon.style.display = "block";
                stopIcon.style.display = "none";
                isRecording = false;

                sendAudioToServer();
            });
        });
        
        completed = !completed
        continueText.style.display = "none";
        restartText.style.display = "block";
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}

function sendAudioToServer() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

    const formData = new FormData();
    formData.append('audio', audioBlob);

    fetch('http://localhost:8081/storytelling/transcript', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("respuesta obtenida: ", data, "\n trans", data.transcription )
        textArea.value += `\n ${data.transcription}`;
    })
    .catch(error => {
        console.error('Error:', error);
        textArea.value = 'Error occurred while transcribing audio D:';
    });


}