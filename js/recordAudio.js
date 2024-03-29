const recordButton = document.getElementById('recordButton');
const textArea = document.getElementById('textArea');
const microphoneIcon = document.getElementById('microphone');
const stopIcon = document.getElementById('stop');
const readStoryButton = document.getElementById('readStoryButton');

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

readStoryButton.addEventListener('click', () => {
    recordButton.style.display = "none";
    readStoryButton.style.display = "none";
    const story = textArea.value;
    const utterance = new SpeechSynthesisUtterance(story);
    utterance.lang = 'es';
    speechSynthesis.speak(utterance);
});

recordButton.addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
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
