const functions = require("firebase-functions");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");

async function transcribeAudio(audioBytes) {
  const tempFilePath = path.join(os.tmpdir(), "temp_audio.m4a");
  fs.writeFileSync(tempFilePath, audioBytes);

  const formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("file", fs.createReadStream(tempFilePath));

  const openaiApiKey = process.env.OPENAI_API_KEY;
  const response = await axios.post(
    "https://api.openai.com/v1/audio/transcriptions",
    formData,
    {
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "multipart/form-data",
        ...formData.getHeaders(),
      },
    }
  );

  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }

  return response.data.text;
}

module.exports = {
  transcribeAudio,
};
