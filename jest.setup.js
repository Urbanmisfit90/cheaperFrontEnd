global.chrome = {
    runtime: {
      onInstalled: {
        addListener: jest.fn(),
      },
      sendMessage: jest.fn(),
    },
    tabs: {
      query: jest.fn(),
      sendMessage: jest.fn(),
    },
    storage: {
      local: {
        get: jest.fn(),
        set: jest.fn(),
      },
    },
  };