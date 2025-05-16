import { useState, useEffect } from 'react';

const isChromeExtension = typeof chrome !== 'undefined' && 
                         chrome?.tabs?.query && 
                         chrome?.tabs?.sendMessage;

function useProductDetection() {
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const detectProduct = async () => {
      if (!isChromeExtension) {
        setError('Not running in extension context');
        setLoading(false);
        return;
      }

      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (!tabs || tabs.length === 0) {
            setError('No active tab found');
            setLoading(false);
            return;
          }

          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: 'extractProductInfo' },
            (response) => {
              if (chrome.runtime.lastError) {
                setError('Content script not available: ' + chrome.runtime.lastError.message);
                setLoading(false);
                return;
              }

              if (response?.productInfo) {
                setProductInfo(response.productInfo);
              } else {
                setError('No product detected on this page');
              }
              setLoading(false);
            }
          );
        });
      } catch (err) {
        setError('Error detecting product: ' + err.message);
        setLoading(false);
      }
    };

    detectProduct();
  }, []);

  return { productInfo, loading, error };
}

export default useProductDetection;