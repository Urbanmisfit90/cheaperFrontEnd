import axios from 'axios';

// Configuration for different retailer APIs
const API_CONFIG = {
  base_url: 'https://api.cheaper.example.com', // Replace with your actual API endpoint
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.base_url,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

/**
 * Search for product prices across multiple retailers
 * @param {string} query - The search query
 * @param {Object} options - Additional search options
 * @returns {Promise<Array>} - Promise resolving to array of results
 */
export const searchProducts = async (query, options = {}) => {
  try {
    const response = await api.get('/search', {
      params: {
        q: query,
        limit: options.limit || 10,
        sort: options.sort || 'price_asc',
        ...options
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Fetch price history for a specific product
 * @param {string} productId - Product identifier
 * @returns {Promise<Object>} - Promise resolving to price history data
 */
export const fetchPriceHistory = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
};

/**
 * Extract product information from current page
 * @returns {Object} Product information from the current page
 */
export const extractProductInfo = () => {
  // This function would be called by the content script to extract
  // product information from the current page
  const extractTitle = () => {
    // Logic to find product title on common shopping sites
    const possibleTitleElements = [
      document.querySelector('h1'),
      document.querySelector('[data-testid="product-title"]'),
      document.querySelector('.product-title'),
      document.querySelector('.product-name'),
      // Add more selectors for common shopping sites
    ];
    
    for (const element of possibleTitleElements) {
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }
    return null;
  };
  
  const extractPrice = () => {
    // Logic to find price on common shopping sites
    const priceSelectors = [
      '.price',
      '.product-price',
      '[data-testid="price"]',
      '.offer-price',
      // Add more selectors for common shopping sites
    ];
    
    for (const selector of priceSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        // Extract numerical value from price text
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
};

export default {
  searchProducts,
  fetchPriceHistory,
  extractProductInfo
};