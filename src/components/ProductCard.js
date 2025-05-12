import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onVisit, onSave }) {
  return (
    <div className="product-card" data-testid="product-card">
      <div className="product-header">
        <h3 className="product-title">{product.title}</h3>
        <button 
          className="save-button" 
          onClick={() => onSave(product)}
          aria-label={`Save ${product.title}`}
        >
          ♡
        </button>
      </div>
      
      <div className="product-price">{product.price}</div>
      <div className="product-site">{product.site}</div>
      
      {product.shipping && (
        <div className="product-shipping">
          Shipping: {product.shipping}
        </div>
      )}
      
      {product.rating && (
        <div className="product-rating">
          Rating: {product.rating} ({product.ratingCount || 0})
        </div>
      )}
      
      <button 
        className="visit-button" 
        onClick={() => onVisit(product.url)}
        aria-label={`Visit ${product.site}`}
      >
        Visit Site
      </button>
    </div>
  );
}

export default ProductCard;