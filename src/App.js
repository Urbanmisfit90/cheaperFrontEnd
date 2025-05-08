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

    // Clear previous results immediately
    setSearchResults([]);

    // Simulating an API call
    setTimeout(() => {
      let mockResults = [];

      // Special case for testing empty results
      if (searchTerm.trim().toLowerCase() === 'empty') {
        mockResults = [];
      } else {
        mockResults = [
          { 
            id: 1, 
            title: `${searchTerm} X`, 
            price: "$499.99", 
            site: "Alibaba" 
          },
          { 
            id: 2, 
            title: `${searchTerm} X`, 
            price: "$475.50", 
            site: "eBay" 
          },
          { 
            id: 3, 
            title: `${searchTerm} X`, 
            price: "$510.00", 
            site: "AliExpress" 
          }
        ];
      }

      setSearchResults(mockResults);
      setIsSearching(false);  // Done loading, hide loading message
    }, 0);  // Set delay to 0 for faster testing
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
              <div key={result.id} className="result-item" data-testid="result-item">
                <div>
                  <div className="result-title">{result.title}</div>
                  <div className="result-price">{result.price}</div>
                  <div className="result-site">{result.site}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results" data-testid="no-results">
              No results found.
            </div>
          )}
        </div>
      )}

      {featureNotification && (
        <div className="feature-notification">
          <span>{featureNotification}</span>
          <button onClick={() => setFeatureNotification('')}>&times;</button>
        </div>
      )}

      {/* Button to trigger feature notification (for testing) */}
      <button
        data-testid="trigger-notification"
        onClick={() => setFeatureNotification('Test Feature!')}
        style={{ display: 'none' }} // Hidden in real UI
      >
        Trigger Notification
      </button>
    </div>
  );
}

export default App;
