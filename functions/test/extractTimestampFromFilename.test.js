const { extractTimestampFromFilename } = require('../src/utils/filename'); // Replace 'yourModule' with the name of the module where your function is defined

describe('extractTimestampFromFilename', () => {
  const testCases = [
    { input: 'Voice 1_W_20220101_100110.m4a', output: new Date(2022, 0, 1, 10, 1, 10) },
    { input: 'Voice 10_W_20220101_100110.m4a', output: new Date(2022, 0, 1, 10, 1, 10) },
    { input: 'Voice 100_W_20220101_100110.m4a', output: new Date(2022, 0, 1, 10, 1, 10) },
    { input: 'Voice 1000_W_20220101_100110.m4a', output: new Date(2022, 0, 1, 10, 1, 10) },
    { input: 'Memo 1_W_20220101_100110.m4a', output: new Date(2022, 0, 1, 10, 1, 10) },
    { input: 'Memo 10_W_20220101_100110.m4a', output: new Date(2022, 0, 1, 10, 1, 10) },
    { input: 'Memo 100_W_20220101_100110.m4a', output: new Date(2022, 0, 1, 10, 1, 10) },
    { input: 'Memo 1000_W_20220101_100110.m4a', output: new Date(2022, 0, 1, 10, 1, 10) },
  ];

  testCases.forEach(({ input, output }) => {
    it(`should correctly extract timestamp from ${input}`, () => {
      const { timestamp, timestampError } = extractTimestampFromFilename(input);
      expect(timestampError).toBe(false);
      expect(timestamp).toEqual(output);
    });
  });
});
