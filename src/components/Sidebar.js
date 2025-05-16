import React from 'react';
import './App.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Category</h2>
      <div className="checkbox-group">
        <label><input type="checkbox" /> Laptops</label>
        <label><input type="checkbox" /> Phones</label>
        <label><input type="checkbox" /> Accessories</label>
      </div>
      <h2>Price</h2>
      <input type="range" min="0" max="1000" />
      <p>$0 - $1000</p>
    </aside>
  );
}

export default Sidebar;
