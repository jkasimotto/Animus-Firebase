const { extractTimestampFromFilename } = require('../src/utils/filename');

describe('extractTimestampFromFilename', () => {
  const timezone = 'Australia/Sydney';

  const testCases = [
    { input: 'Voice 1_W_20220101_100110.m4a', output: new Date('2022-01-01T10:01:10') },
    { input: 'Voice 10_W_20220101_100110.m4a', output: new Date('2022-01-01T10:01:10') },
    { input: 'Voice 100_W_20220101_100110.m4a', output: new Date('2022-01-01T10:01:10') },
    { input: 'Voice 1000_W_20220101_100110.m4a', output: new Date('2022-01-01T10:01:10') },
    { input: 'Memo 1_W_20220101_100110.m4a', output: new Date('2022-01-01T10:01:10') },
    { input: 'Memo 10_W_20220101_100110.m4a', output: new Date('2022-01-01T10:01:10') },
    { input: 'Memo 100_W_20220101_100110.m4a', output: new Date('2022-01-01T10:01:10') },
    { input: 'Memo 1000_W_20220101_100110.m4a', output: new Date('2022-01-01T10:01:10') },
  ];

  testCases.forEach(({ input, output }) => {
    it(`should correctly extract timestamp from ${input}`, () => {
      const { timestamp, timestampError } = extractTimestampFromFilename(input, timezone);
      console.log(timestamp, output);
      expect(timestampError).toBe(false);
      expect(timestamp).toEqual(output);
    });
  });
});
