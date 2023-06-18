const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Configuration, OpenAIApi } = require("openai");
const moment = require('moment-timezone');

module.exports = functions
    .runWith({ secrets: ["OPENAI_API_KEY"], timeoutSeconds: 540 })
    .https.onCall(async (data, context) => {
        // Ensure the user is authenticated
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to generate a report.');
        }

        // Get the user's ID
        const userId = context.auth.uid;

        // Get the report type
        const reportType = data.reportType;

        // Get the report id if it exists
        const reportId = data.reportId;

        // Get the date for which to generate the report
        const reportDate = new Date(data.date);

        functions.logger.info(reportType);
        functions.logger.info(reportDate);

        // Fetch the report template from Firestore
        const templateSnapshot = await admin.firestore().collection('reportTemplates')
            .where('type', '==', reportType)
            .get();

        // If there is no template, throw an error
        if (templateSnapshot.empty) {
            throw new functions.https.HttpsError('not-found', `No template found for report type ${reportType}.`);
        }

        // Get the template's system prompt
        const systemPrompt = templateSnapshot.docs[0].data().systemPrompt;

        // Get the user's timezone. This could come from the user's profile in your Firestore database.
        const userTimezone = 'Australia/Sydney'; // replace with the actual timezone

        // Parse the report date in the user's timezone
        const reportDay = moment(reportDate).tz(userTimezone).startOf('day').toDate();

        // Get the next day in the user's timezone
        const nextDay = moment(reportDate).tz(userTimezone).add(1, 'day').startOf('day').toDate();

        // Fetch documents from Firestore that were created on the report day in the user's timezone
        const snapshot = await admin.firestore().collection('media')
            .where('userId', '==', userId)
            .where('timestamp', '>=', reportDay)
            .where('timestamp', '<', nextDay)
            .get();

        // If there are no documents, throw an error
        if (snapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'No documents found for the selected day.');
        }

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });

        functions.logger.info("OPENAI_API_KEY: " + process.env.OPENAI_API_KEY);

        const openai = new OpenAIApi(configuration);

        const messages = [];

        // Add system prompt
        messages.push({
            role: 'system',
            content: systemPrompt,
        });

        // Add user messages from Firestore documents
        snapshot.forEach(doc => {
            let timestamp = moment(doc.data().timestamp.toDate()).tz(userTimezone);
            let content = timestamp.format('YYYY-MM-DD HH:mm:ss') + ' ' + doc.data().text;
            messages.push({
                role: 'user',
                content: content,
            });
        });

        functions.logger.info(messages);

        try {
            // Call the Chat API
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 0.5,
            });

            // Get the response text
            const responseText = response.data.choices[0].message.content;

            functions.logger.info(responseText);

            // Get the substring of responseText starting from the first occurrence of '|'
            const strippedText = responseText.substring(responseText.indexOf('|'));

            functions.logger.info(strippedText);

            // Get the substring of strippedText from the beginning to the last occurrence of '|' plus one
            const finalText = strippedText.substring(0, strippedText.lastIndexOf('|') + 1);

            functions.logger.info(finalText);

            // If a report ID was provided, update the existing report document
            if (reportId) {
                await admin.firestore().collection('reports').doc(reportId).update({
                    text: finalText,
                    date: reportDate,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            } else {
                // Store the resulting text in a new report document
                await admin.firestore().collection('reports').add({
                    userId: userId,
                    reportType: reportType, // Add report type to the report document
                    text: finalText,
                    date: reportDate,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }

            functions.logger.info('Report generated successfully.');

            // Return a success message
            return { message: 'Report generated successfully.' };
        } catch (error) {
            // Log the error
            functions.logger.error(error);
            functions.logger.info('Report generation failed.');
            functions.logger.info(error);
        }

    });
