const recordButton = document.getElementById('recordButton');
const textArea = document.getElementById('textArea');
const microphoneIcon = document.getElementById('microphone');
const stopIcon = document.getElementById('stop');


recordButton.addEventListener('click', () => {
    stopIcon.style.display = "block";
    microphoneIcon.style.display = "none";
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            const audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                microphoneIcon.style.display = "block";
                stopIcon.style.display = "none";
                textArea.value = "Recording stopped";

            });

            setTimeout(() => {
                mediaRecorder.stop();
            }, 3000);
        });
});
