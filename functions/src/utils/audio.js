const functions = require("firebase-functions");
const axios = require("axios");

async function moveMoovAtomToStart(audioBytes) {
  const endpointUrl = process.env.AUDIO_CONVERSION_ENDPOINT_URL;
  const headers = {
    "file-extension": "m4a",
    "Content-Type": "application/octet-stream",
  };

  try {
    // Log the size of the audio file
    functions.logger.info("Audio file size: ", audioBytes.length);
    const response = await axios.post(endpointUrl, audioBytes, {
      headers,
      responseType: "arraybuffer",
      timeout: 60000, // 60 seconds
    });
    functions.logger.info("Moved moov atom to start");
    // Log the response data
    functions.logger.info("Response data: ", response.data);
    // Log the size of the response data
    functions.logger.info("Response data size: ", response.data.length);
    return response.data;
  } catch (error) {
    functions.logger.error("Error: ", error);
    return null;
  }
}

module.exports = {
  moveMoovAtomToStart,
};
