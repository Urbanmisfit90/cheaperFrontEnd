// Mock chrome API for tests
global.chrome = {
  storage: {
    local: {
      get: jest.fn((key, callback) => callback({})),
      set: jest.fn(),
    },
  },
  tabs: {
    query: jest.fn((queryInfo, callback) => callback([{ id: 1 }])),
    create: jest.fn(),
    sendMessage: jest.fn(),
  },
  runtime: {
    lastError: null,
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
  },
  action: {
    openPopup: jest.fn(),
  },
};