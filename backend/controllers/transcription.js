const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();
const config = {
    //encoding: 'LINEAR16',
    //sampleRateHertz: 48000,
    languageCode: 'es-ES',
};

module.exports = {
   async transcriptAudio(req, res){
      try {
         if (!req.file) {
             console.log('No audio file provided'); 
             return res.status(400).json({ message: 'No audio file provided' });
         }
 
         const audioFile = req.file.buffer;
 
         const [response] = await client.recognize({
             audio: {
                 content: audioFile,
             },
             config: config,
         });
         console.log("respuesta obtenida: ", response)
         const transcription = response.results
             .map(result => result.alternatives[0].transcript)
             .join('\n');
 
         res.status(200).json({ transcription: transcription });
     } catch (error) {
         console.error('Error:', error);
         res.status(500).json({ message: 'Error occurred while transcribing audio' });
     }
   },
}
