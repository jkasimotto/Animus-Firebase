const functions = require('firebase-functions');
const { transcribeAudio: transcribe } = require('../utils/transcription');
const {Buffer} = require('buffer');

module.exports = functions
    .runWith({ secrets: ['OPENAI_API_KEY'] })
    .https.onCall(async (data, context) => {
        const audioBytes = data.audioBytes; // Assuming audio bytes sent in data

        const buffer = Buffer.from(audioBytes, 'base64');

        // Transcribe the audio file using your transcription API
        functions.logger.info('Transcribing audio file...');
        let transcription;
        try {
            transcription = await transcribe(buffer);
        } catch (error) {
            functions.logger.error('Transcription failed.', error);
            throw new functions.https.HttpsError('internal', 'Transcription failed');
        }

        functions.logger.info('Transcription completed.');
        return {
            transcription
        };
    });
