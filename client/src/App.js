import React, { useState } from 'react';
import './styles.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState('');

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
        <button className="button" disabled={loading}>
          {loading ? 'Loading...' : 'Monthly Sales'}
        </button>
        <button className="button" disabled={loading}>
          {loading ? 'Loading...' : 'Total Sales'}
        </button>
      </div>
    </div>
  );
}

export default App;
