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

const cuentoInicial = `En el corazón del bosque encantado, vivía una pequeña ardilla llamada Nuka, famosa por su pelaje rojizo y su astucia. Un día, mientras recolectaba nueces para el invierno, Nuka se encontró con un pequeño polluelo que había caído de su nido. El polluelo, asustado y sin poder volar, piaba desconsoladamente.

Nuka, con su corazón bondadoso, no pudo dejar al polluelo a su suerte. Decidió ayudarlo a regresar a su nido, ubicado en lo alto de un árbol frondoso. Nuka trepó con cuidado, esquivando ramas y sorteando obstáculos, con el polluelo a salvo en su pelaje.

Sin embargo, al llegar al nido, Nuka se encontró con un problema: era demasiado alto para alcanzarlo sin ayuda. Desesperada, miró a su alrededor buscando una solución. De pronto, vio una bandada de gorriones que revoloteaban cerca. Nuka ideó un plan.`; 

textArea.value = cuentoInicial

recordButton.addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

continueButton.addEventListener('click', () => {
    if (!completed) {
        completed = !completed
        continueText.style.display = "none";
        restartText.style.display = "block";
        textArea.value += `\n\nCon una rama flexible, Nuka construyó una pequeña catapulta. Sujetó al polluelo con cuidado y, con un impulso preciso, lo lanzó hacia el nido. El polluelo, con un aleteo torpe, logró aterrizar sano y salvo junto a sus hermanos.

Los pájaros, conmovidos por la acción heroica de Nuka, la celebraron con un canto alegre. Nuka, con una sonrisa de satisfacción, regresó al bosque, orgullosa de haber ayudado al pequeño polluelo y de haber demostrado que la astucia y la bondad siempre encuentran una solución.`;
    } else {
        completed = !completed
        restartText.style.display = "none";
        continueText.style.display = "block";
        textArea.value = cuentoInicial;
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