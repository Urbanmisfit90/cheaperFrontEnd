// Listen for the extension installation event
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js'], // Ensure content.js exists and is listed in manifest.json
      });
    } else {
      console.warn('No active tab found. Script injection skipped.');
    }
  });
});
