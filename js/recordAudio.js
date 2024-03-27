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
                // const audioBlob = new Blob(audioChunks);
                // const audioUrl = URL.createObjectURL(audioBlob);
                // const audio = new Audio(audioUrl);
                // audio.play();
                // const reader = new FileReader();
                // reader.readAsDataURL(audioBlob);
                // reader.onloadend = function () {
                //     base64data = reader.result;
                //     textArea.value = "base64data";
                // }
            });

            setTimeout(() => {
                mediaRecorder.stop();
            }, 3000);
        });
});
