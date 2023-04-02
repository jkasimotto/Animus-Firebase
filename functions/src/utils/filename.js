const functions = require("firebase-functions");
const { format, utcToZonedTime } = require("date-fns-tz");

function extractTimestampFromFilename(filename, timezone) {
  const timestampRegex = /(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/;
  functions.logger.info(`Filename: ${filename}`);
  functions.logger.info(`Filename length: ${filename.length}`);
  functions.logger.info(
    `Filename matches expected format: ${timestampRegex.test(filename)}`
  );

  // Check if the filename matches the expected format
  const match = filename.match(timestampRegex);
  if (match) {
    const [, year, month, day, hour, minute, second] = match;
    const localTimestamp = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1, // JavaScript Date object uses zero-based month indexing
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(minute, 10),
      parseInt(second, 10)
    );

    functions.logger.info(`Extracted timestamp from filename: ${filename}`);
    functions.logger.info(`Timestamp: ${localTimestamp}`);

    return { timestamp: localTimestamp, timestampError: false };
  } else {
    return { timestamp: null, timestampError: true };
  }
}

module.exports = {
  extractTimestampFromFilename,
};
