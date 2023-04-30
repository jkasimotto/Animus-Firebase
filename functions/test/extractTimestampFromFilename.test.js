const { extractTimestampFromFilename } = require('../src/utils/filename');
const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');

describe('extractTimestampFromFilename', () => {
  const timezone = 'Australia/Sydney';
  const sydneyTimezone = 'Australia/Sydney';
  const sydneyDate = utcToZonedTime('2022-01-01T10:01:10', sydneyTimezone);

  const testCases = [
    { input: 'Voice 1_W_20220101_100110.m4a', output: sydneyDate },
    { input: 'Voice 10_W_20220101_100110.m4a', output: sydneyDate },
    { input: 'Voice 100_W_20220101_100110.m4a', output: sydneyDate },
    { input: 'Voice 1000_W_20220101_100110.m4a', output: sydneyDate },
    { input: 'Memo 1_W_20220101_100110.m4a', output: sydneyDate },
    { input: 'Memo 10_W_20220101_100110.m4a', output: sydneyDate },
    { input: 'Memo 100_W_20220101_100110.m4a', output: sydneyDate },
    { input: 'Memo 1000_W_20220101_100110.m4a', output: sydneyDate }
  ];

  testCases.forEach(({ input, output }) => {
    it(`should correctly extract timestamp ${output} from ${input}`, () => {
      const { timestamp, timestampError } = extractTimestampFromFilename(input);

      console.log(timestamp, output);
      expect(timestampError).toBe(false);
      expect(timestamp).toEqual(output);
    });
  });
});
