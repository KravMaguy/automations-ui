// __mocks__/chrome.js
const chrome = {
  storage: {
    local: {
      get: jest.fn((keys, callback) => callback({})),
      set: jest.fn(),
    },
    onChanged: {
      addListener: jest.fn(),
    },
  },
  tabs: {
    create: jest.fn((createProperties, callback) => callback({ id: 1 })),
    onUpdated: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    sendMessage: jest.fn(),
    onRemoved: {
      addListener: jest.fn(),
    },
  },
  runtime: {
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    sendMessage: jest.fn(),
    lastError: null,
  },
};

global.chrome = chrome;

export default chrome;
