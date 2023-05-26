const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Configuration, OpenAIApi } = require("openai");
const moment = require('moment-timezone');

module.exports = functions
    .runWith({ secrets: ["OPENAI_API_KEY"] })
    .https.onCall(async (data, context) => {
        // Ensure the user is authenticated
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to generate a report.');
        }

        // Get the user's ID
        const userId = context.auth.uid;

        // Get the user's timezone. This could come from the user's profile in your Firestore database.
        const userTimezone = 'Australia/Sydney'; // replace with the actual timezone

        // Get today's date in the user's timezone
        const today = moment().tz(userTimezone).startOf('day').toDate();

        // Get tomorrow's date in the user's timezone
        const tomorrow = moment().tz(userTimezone).add(1, 'day').startOf('day').toDate();

        // Fetch documents from Firestore that were created today in the user's timezone
        const snapshot = await admin.firestore().collection('media')
            .where('userId', '==', userId)
            .where('timestamp', '>=', today)
            .where('timestamp', '<', tomorrow)
            .get();

        // If there are no documents, throw an error
        if (snapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'No documents found for today.');
        }

        // Concatenate the text of each document into a single string with timestamp
        let prompt = ``;
        snapshot.forEach(doc => {
            let timestamp = moment(doc.data().timestamp.toDate()).tz(userTimezone);
            prompt += timestamp.format('YYYY-MM-DD HH:mm:ss') + ' ' + doc.data().text + ' ';
        });
        prompt += `

        Write a table of things I did today (in chronological order):

        | Task | Start Time | End Time | Location (if known) | People (if known) | 
        `

        functions.logger.info(prompt, { structuredData: true })
        functions.logger.info("OPENAI_API_KEY: " + process.env.OPENAI_API_KEY, { structuredData: true })

        // Call the GPT-3 API
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 2000
        });

        // Store the resulting text in a new report document
        await admin.firestore().collection('reports').add({
            userId: userId,
            text: response.data.choices[0].text,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Return a success message
        return { message: 'Report generated successfully.' };
    });
