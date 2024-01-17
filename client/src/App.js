import React, { useState } from 'react';
import './styles.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState('');

  const handleButtonClick = () => {
    setLoading(true);

    // Simulate loading for 1 second
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Vendor Name"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        className="input"
      />
      <div className="button-container">
        <button className="button" disabled={loading} onClick={handleButtonClick}>
          Monthly Sales
        </button>
        <button className="button" disabled={loading} onClick={handleButtonClick}>
          Total Sales
        </button>
      </div>
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default App;
