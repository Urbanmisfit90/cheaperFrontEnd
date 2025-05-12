import React, { useState } from 'react';
//import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // This will trigger the search even with empty input
    onSearch(input);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for products..."
        aria-label="Search for products"
      />
      <button type="submit" aria-label="Search">
        Search
      </button>
    </form>
  );
}

export default SearchBar;