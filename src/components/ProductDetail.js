import React from 'react';
import './App.css';

function ProductDetail({ product, onClose }) {
  return (
    <div className="product-detail">
      <button onClick={onClose} className="close-detail">×</button>
      <h3>{product.name}</h3>
      <p>Amazon: ${product.price}</p>
      <p>eBay: ${product.price + 36}</p>
      <p>Best Buy: ${product.price + 60}</p>
      <p className="description-title">Description</p>
      <p>A retro-styled television set with a modern display and vintage design.</p>
      <button className="buy-button">Buy →</button>
    </div>
  );
}

export default ProductDetail;
