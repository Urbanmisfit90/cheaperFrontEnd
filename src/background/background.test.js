// Cache for storing product search results
const searchCache = {};

// Listen for installation event
chrome.runtime.onInstalled.addListener(() => {
  // Set up context menu
  chrome.contextMenus.create({
    id: 'searchCheaper',
    title: 'Search for better prices',
    contexts: ['selection']
  });
  
  // Initial setup for options
  chrome.storage.local.get('cheaperOptions', (result) => {
    if (!result.cheaperOptions) {
      // Default options
      chrome.storage.local.set({
        cheaperOptions: {
          autoCompare: true,
          showNotifications: true,
          includeTax: true,
          preferredStores: []
        }
      });
    }
  });
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'searchCheaper' && info.selectionText) {
    // Open the popup with the selected text as search
    chrome.storage.local.set({ 
      lastSearch: info.selectionText 
    }, () => {
      chrome.action.openPopup();
    });
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findAlternatives') {
    const { productInfo } = request;
    const cacheKey = productInfo.title.toLowerCase().trim();
    
    // Check cache first
    if (searchCache[cacheKey] && 
        (Date.now() - searchCache[cacheKey].timestamp) < 1000 * 60 * 30) { // 30 min cache
      sendResponse({ alternatives: searchCache[cacheKey].results });
      return true;
    }
    
    // For demo purposes, returning mock data
    // In a real implementation, this would call your API service
    const mockAlternatives = [
      { 
        price: '$' + (parseFloat(productInfo.price) * 0.85).toFixed(2), 
        site: 'eBay', 
        url: 'https://www.ebay.com' 
      },
      { 
        price: '$' + (parseFloat(productInfo.price) * 0.90).toFixed(2), 
        site: 'Amazon', 
        url: 'https://www.amazon.com' 
      },
      { 
        price: '$' + (parseFloat(productInfo.price) * 0.95).toFixed(2), 
        site: 'Walmart', 
        url: 'https://www.walmart.com' 
      }
    ];
    
    // Cache the results
    searchCache[cacheKey] = {
      timestamp: Date.now(),
      results: mockAlternatives
    };
    
    sendResponse({ alternatives: mockAlternatives });
    return true;
  }
  
  return false;
});

// Function to check if a URL is a product page
function isProductPage(url) {
  const productPatterns = [
    /amazon\.com.*\/dp\//,
    /amazon\.com.*\/gp\/product/,
    /ebay\.com.*\/itm\//,
    /walmart\.com.*\/ip\//,
    /bestbuy\.com.*\/site\//,
    /target\.com.*\/p\//
    // Add more patterns for other sites
  ];
  
  return productPatterns.some(pattern => pattern.test(url));
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the page is fully loaded and is potentially a product page
  if (changeInfo.status === 'complete' && tab.url && isProductPage(tab.url)) {
    // Get extension options
    chrome.storage.local.get('cheaperOptions', (result) => {
      const options = result.cheaperOptions || {};
      
      // Only inject if autoCompare is enabled
      if (options.autoCompare !== false) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ['content.js']
        });
      }
    });
  }
});