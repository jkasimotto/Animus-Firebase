const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const { updateMedia } = require("../firestore");

module.exports = functions
  .runWith({ secrets: ["OPENAI_API_KEY"] })
  .firestore.document("media/{mediaId}")
  .onWrite(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    functions.logger.info("New value:", newValue);
    functions.logger.info("Previous value:", previousValue);

    if (!previousValue || newValue.text !== previousValue.text) {
      const title = await generateTitle(newValue.text);
      updateMedia(context.params.mediaId, {
        title,
      });
    }
  });

async function generateTitle(text) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  functions.logger.info("Configuration:", configuration);
  const openaiApiKey = process.env.OPENAI_API_KEY;
  functions.logger.info("OpenAI API key:", openaiApiKey);
  const openai = new OpenAIApi(openaiApiKey, configuration);
  functions.logger.info("OpenAI:", openai);
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        prompt: `Title: ${text}\n\nTitle:`,
        max_tokens: 60,
        temperature: 0.3,
        model: "text-davinci-003",
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    functions.logger.info("Response:", response.data.choices[0].text);
    return response.data.choices[0].text;
  } catch (error) {
    functions.logger.error("Error:", error);
  }
}
