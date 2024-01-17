import React, { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState('');

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100vh',
    padding: '20px', // Add some space at the top
    background: 'linear-gradient(to bottom, #00fd00, #005f00)', // Gradient background
  };

  const inputStyle = {
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#36D7B7',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Vendor Name"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        style={inputStyle}
      />
      <div style={buttonContainerStyle}>
        <button style={buttonStyle} disabled={loading}>
          {loading ? 'Loading...' : 'Monthly Sales'}
        </button>
        <button style={buttonStyle} disabled={loading}>
          {loading ? 'Loading...' : 'Total Sales'}
        </button>
      </div>
    </div>
  );
}

export default App;
