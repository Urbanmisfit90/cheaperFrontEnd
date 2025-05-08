/* global chrome */
// Listen for the extension installation event
chrome.runtime.onInstalled.addListener(() => {
    // When the extension is installed, query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Execute a script on the active tab
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js'], // Assuming 'content.js' exists
      });
    });
  });