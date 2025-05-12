import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';

// Safely check for Chrome extension API availability
const isChromeExtension = typeof chrome !== 'undefined' && 
                         chrome?.storage?.local && 
                         chrome?.tabs?.create;

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [featureNotification, setFeatureNotification] = useState('');
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [savedProducts, setSavedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isTestMode] = useState(process.env.NODE_ENV === 'test');

  useEffect(() => {
    const fetchSavedProducts = async () => {
      try {
        if (isChromeExtension) {
          chrome.storage.local.get('savedProducts', (result) => {
            if (result.savedProducts) {
              setSavedProducts(result.savedProducts);
            }
          });
        } else {
          const saved = localStorage.getItem('savedProducts');
          if (saved) setSavedProducts(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error fetching saved products:', err);
      }
    };

    fetchSavedProducts();
  }, []);

  const handleSearch = (searchTerm) => {
    const term = searchTerm.trim();
    
    // Always update search states
    setIsSearching(true);
    setHasSearched(true);
    setSearchResults([]);
    setError(null);

    // If empty search, show "no results" immediately
    if (!term) {
      setIsSearching(false);
      return;
    }

    try {
      setTimeout(() => {
        let mockResults = [];

        if (term.toLowerCase() === 'empty') {
          mockResults = [];
        } else if (term.toLowerCase() === 'error') {
          setError('An error occurred while searching. Please try again.');
        } else {
          mockResults = [
            { 
              id: 1, 
              title: `${term}`, 
              price: "$499.99", 
              site: "Alibaba", 
              shipping: "Free shipping",
              rating: 4.5,
              ratingCount: 128,
              url: "https://www.alibaba.com"
            },
            { 
              id: 2, 
              title: `${term}`, 
              price: "$475.50", 
              site: "eBay", 
              shipping: "$5.99 shipping",
              rating: 4.2,
              ratingCount: 97,
              url: "https://www.ebay.com"
            },
            { 
              id: 3, 
              title: `${term}`, 
              price: "$450.50", 
              site: "AliExpress", 
              shipping: "$5.99 shipping",
              rating: 4.1,
              ratingCount: 80,
              url: "https://www.aliexpress.us/"
            }
          ];
        }

        setSearchResults(mockResults);
        setIsSearching(false);
      }, 500);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
      setIsSearching(false);
    }
  };

  const handleVisitSite = (url) => {
    if (isChromeExtension) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  const handleSaveProduct = (product) => {
    const isAlreadySaved = savedProducts.some(p => p.id === product.id);
    let updatedSavedProducts;
    
    if (isAlreadySaved) {
      updatedSavedProducts = savedProducts.filter(p => p.id !== product.id);
      setFeatureNotification(`Removed ${product.title} from saved items`);
    } else {
      updatedSavedProducts = [...savedProducts, product];
      setFeatureNotification(`Saved ${product.title} for later`);
    }
    
    setSavedProducts(updatedSavedProducts);
    
    if (isChromeExtension) {
      chrome.storage.local.set({ savedProducts: updatedSavedProducts });
    } else {
      localStorage.setItem('savedProducts', JSON.stringify(updatedSavedProducts));
    }
    
    setTimeout(() => setFeatureNotification(''), 3000);
  };

  const handleAcceptCookies = () => {
    setShowCookieBanner(false);
    if (isChromeExtension) {
      chrome.storage.local.set({ cookiePreference: 'accepted' });
    } else {
      localStorage.setItem('cookiePreference', 'accepted');
    }
  };

  return (
    <div className="App">
      {/* Top Sticky Banner */}
      <div className="sticky-banner top-banner">
        🚀 Free shipping on all orders over $50! 🚀
      </div>

      <h1>Cheaper</h1>
      <p>Find the best prices across websites!</p>

      <SearchBar onSearch={handleSearch} />

      {isSearching && (
        <div className="loading">Searching for the best prices...</div>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {!isSearching && hasSearched && (
        <div className="results-container">
          <h2>Search Results</h2>
          {searchResults.length > 0 ? (
            searchResults.map(result => (
              <ProductCard 
                key={result.id}
                product={result}
                onVisit={handleVisitSite}
                onSave={handleSaveProduct}
                isSaved={savedProducts.some(p => p.id === result.id)}
              />
            ))
          ) : (
            <div className="no-results" data-testid="no-results">
              No results found.
            </div>
          )}
        </div>
      )}

      {featureNotification && (
        <div className="feature-notification" aria-live="polite">
          <span>{featureNotification}</span>
          <button 
            onClick={() => setFeatureNotification('')} 
            aria-label="Close notification"
            data-testid="close-notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Bottom Cookie Banner */}
      {showCookieBanner && (
        <div className="sticky-banner bottom-banner" data-testid="cookie-banner">
          <div>
            We use cookies to improve your experience.
            <button 
              className="accept-btn" 
              onClick={handleAcceptCookies}
              aria-label="Accept cookies"
            >
              Accept
            </button>
          </div>
          <button 
            className="close-btn"
            onClick={() => setShowCookieBanner(false)}
            aria-label="Close cookie banner"
          >
            &times;
          </button>
        </div>
      )}

      {isTestMode && (
        <button
          data-testid="trigger-notification"
          onClick={() => setFeatureNotification('Test Feature!')}
        >
          Trigger Notification
        </button>
      )}
    </div>
  );
}

export default App;