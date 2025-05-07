import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [featureNotification, setFeatureNotification] = useState('');

  const handleSearch = (searchTerm) => {
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulating an API call with setTimeout
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: `${searchTerm} X`, price: "$499.99", site: "Alibaba" },
        { id: 2, title: `${searchTerm} X`, price: "$475.50", site: "eBay" },
        { id: 3, title: `${searchTerm} X`, price: "$510.00", site: "AliExpress" }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="App">
      <h1>Cheaper</h1>
      <p>Find the best prices across websites!</p>
      
      <SearchBar onSearch={handleSearch} />
      
      {isSearching && (
        <div className="loading">Searching for the best prices...</div>
      )}
      
      {!isSearching && hasSearched && (
        <div className="results-container">
          <h2>Search Results</h2>
          
          {searchResults.length > 0 ? (
            searchResults.map(result => (
              <div key={result.id} className="result-item">
                <div>
                  <div className="result-title">{result.title}</div>
                  <div className="result-site">{result.site}</div>
                </div>
                <div className="result-price">{result.price}</div>
              </div>
            ))
          ) : (
            <div className="no-results">No results found. Try another search term.</div>
          )}
        </div>
      )}
      
      <button 
        onClick={() => setFeatureNotification('Comparison feature coming in our next update!')}
        aria-live="polite"
      >
        Compare Across More Sites
      </button>

      {featureNotification && (
        <div className="feature-notification">
          {featureNotification}
          <button 
            onClick={() => setFeatureNotification('')}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;