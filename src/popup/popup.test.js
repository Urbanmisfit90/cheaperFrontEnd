global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
  },
};

test('popup script runs without errors', () => {
  require('./popup');
  expect(true).toBe(true); // Placeholder to ensure file is covered
});
