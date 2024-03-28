const recordButton = document.getElementById('recordButton');
const textArea = document.getElementById('textArea');


recordButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            const audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                textArea.value = "Recording stopped";

            });

            setTimeout(() => {
                mediaRecorder.stop();
            }, 3000);
        });
});
