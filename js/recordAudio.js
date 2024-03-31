import { GoogleGenerativeAI } from "@google/generative-ai";
const recordButton = document.getElementById('recordButton');
const continueButton = document.getElementById('continueButton');
const finishButton = document.getElementById('finishButton');
const textArea = document.getElementById('textArea');
const microphoneIcon = document.getElementById('microphone');
const stopIcon = document.getElementById('stop');
const finishText = document.getElementById('finish');
const restartText = document.getElementById('restart');
const exportButton = document.getElementById('exportButton');


let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let completed = false;
let text = "";

const genAI = new GoogleGenerativeAI("AIzaSyDOf0NoumfYp7JH53zpsl6TtDgg-E-j3nY");

recordButton.addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

async function history(final) {
    if (final === false) {

        console.log(textArea.value);
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const prompt = "Agrega cuatro renglones a la historia en prosa" + textArea.value;
  
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        textArea.value += "\n" + text;
    }

    else {
        console.log(textArea.value);
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const prompt = "Termina en cuatro renglones la historia en prosa: " + textArea.value + "Responde y no vuelvas a contar la misma historia";
  
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        textArea.value += "\n" + text;
    }
  }

  continueButton.addEventListener('click', () => {
    history(false);
  })

finishButton.addEventListener('click', () => {
    if (!completed) {
        history(true);
        completed = !completed;
        finishText.style.display = "none";
        restartText.style.display = "block";
    }

    else {
        completed = !completed;
        restartText.style.display = "none";
        finishText.style.display = "block";
        textArea.value = "";
    }
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

exportButton.addEventListener('click', (event) => {
    const text = textArea.value;
    var json_string = JSON.stringify(text, undefined, 2);
    var link = document.createElement('a');
    link.download = 'StoryTellingHistoria.txt';
    var blob = new Blob([json_string], {type: 'text/plain'});
    link.href = window.URL.createObjectURL(blob);
    link.click();
})