// Function to extract product information from current page
function extractProductInfo() {
    // Similar logic to the extractProductInfo function in api.js
    // but simplified for the content script
    const extractTitle = () => {
      const possibleTitleElements = [
        document.querySelector('h1'),
        document.querySelector('[data-testid="product-title"]'),
        document.querySelector('.product-title'),
        document.querySelector('.product-name'),
      ];
      
      for (const element of possibleTitleElements) {
        if (element && element.textContent.trim()) {
          return element.textContent.trim();
        }
      }
      return null;
    };
    
    const extractPrice = () => {
      const priceSelectors = [
        '.price',
        '.product-price',
        '[data-testid="price"]',
        '.offer-price',
      ];
      
      for (const selector of priceSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
          const priceText = element.textContent.trim();
          const priceMatch = priceText.match(/[\d,.]+/);
          return priceMatch ? priceMatch[0] : null;
        }
      }
      return null;
    };
    
    return {
      title: extractTitle(),
      price: extractPrice(),
      url: window.location.href,
      domain: window.location.hostname,
      timestamp: new Date().toISOString()
    };
  }
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractProductInfo') {
      const productInfo = extractProductInfo();
      sendResponse({ productInfo });
    }
    // Return true to indicate you want to send a response asynchronously
    return true;
  });
  
  // Inject a notification bubble when the product is found elsewhere for cheaper
  function injectPriceBubble(alternatives) {
    // Remove any existing bubbles
    const existingBubble = document.getElementById('cheaper-bubble');
    if (existingBubble) {
      existingBubble.remove();
    }
    
    // Create the bubble element
    const bubble = document.createElement('div');
    bubble.id = 'cheaper-bubble';
    bubble.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #ffffff;
      border: 2px solid #007bff;
      border-radius: 8px;
      padding: 15px;
      max-width: 300px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;
    
    // Create bubble content
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'Found it cheaper!';
    title.style.margin = '0';
    title.style.color = '#007bff';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
    `;
    closeBtn.onclick = function() {
      bubble.remove();
    };
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    bubble.appendChild(header);
    
    // Add alternatives
    const list = document.createElement('div');
    
    alternatives.slice(0, 3).forEach(alt => {
      const item = document.createElement('div');
      item.style.cssText = `
        border-bottom: 1px solid #eee;
        padding: 8px 0;
      `;
      
      const priceEl = document.createElement('div');
      priceEl.textContent = alt.price;
      priceEl.style.cssText = `
        font-weight: bold;
        color: #28a745;
        font-size: 16px;
      `;
      
      const siteEl = document.createElement('div');
      siteEl.textContent = alt.site;
      siteEl.style.color = '#666';
      
      const link = document.createElement('a');
      link.href = alt.url || '#';
      link.textContent = 'View Deal';
      link.style.cssText = `
        display: inline-block;
        margin-top: 5px;
        color: #007bff;
        text-decoration: none;
      `;
      link.target = '_blank';
      
      item.appendChild(priceEl);
      item.appendChild(siteEl);
      item.appendChild(link);
      list.appendChild(item);
    });
    
    bubble.appendChild(list);
    document.body.appendChild(bubble);
  }
  
  // Check if the current page is a product page and show alternatives if available
  function checkForAlternatives() {
    const productInfo = extractProductInfo();
    
    // Only proceed if we successfully extracted a product title
    if (productInfo.title) {
      // Send the product info to the background script to find alternatives
      chrome.runtime.sendMessage(
        { action: 'findAlternatives', productInfo },
        (response) => {
          if (response && response.alternatives && response.alternatives.length > 0) {
            // Filter alternatives that are cheaper than the current price
            const currentPrice = parseFloat(productInfo.price.replace(/[^0-9.]/g, ''));
            const cheaperAlternatives = response.alternatives.filter(alt => {
              const altPrice = parseFloat(alt.price.replace(/[^0-9.]/g, ''));
              return altPrice < currentPrice;
            });
            
            if (cheaperAlternatives.length > 0) {
              injectPriceBubble(cheaperAlternatives);
            }
          }
        }
      );
    }
  }
  
  // Run the check when the page is fully loaded
  window.addEventListener('load', () => {
    // Give the page a moment to fully render dynamic content
    setTimeout(checkForAlternatives, 1500);
  });