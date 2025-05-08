describe('background.js', () => {
  let onInstalledCallback;

  beforeEach(() => {
    global.chrome = {
      runtime: {
        onInstalled: {
          addListener: jest.fn((cb) => {
            onInstalledCallback = cb;
          }),
        },
      },
      tabs: {
        query: jest.fn((queryInfo, cb) => cb([{ id: 42 }])),
      },
      scripting: {
        executeScript: jest.fn(),
      },
    };

    // Import background script after mocking chrome
    jest.resetModules();
    require('./background');
  });

  test('registers onInstalled listener', () => {
    expect(global.chrome.runtime.onInstalled.addListener).toHaveBeenCalledTimes(1);
    expect(typeof onInstalledCallback).toBe('function');
  });

  test('calls chrome.tabs.query on install', () => {
    onInstalledCallback(); // simulate the event
    expect(global.chrome.tabs.query).toHaveBeenCalledWith(
      { active: true, currentWindow: true },
      expect.any(Function)
    );
  });

  test('calls chrome.scripting.executeScript with correct args', () => {
    onInstalledCallback(); // simulate the event
    expect(global.chrome.scripting.executeScript).toHaveBeenCalledWith({
      target: { tabId: 42 },
      files: ['content.js'],
    });
  });
});