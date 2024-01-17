import React, { useState } from 'react';
import './styles.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState('');

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Align to the top
    alignItems: 'center',
    height: '100vh',
    padding: '20px', // Add some space at the top
    background: 'linear-gradient(to bottom, #00fd00, #005f00)', // Gradient background
  };

  const inputStyle = {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#0ACA30',
    color: 'white',
    border: '2px solid #228B22',
    borderRadius: '5px',
    width: '300px',
    '::placeholder': {
      color: 'rgba(0, 0, 0, 0.7)', // Lighten the placeholder text color
    },
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
  };

  const buttonStyle = {
    padding: '15px 25px', // Larger padding for a more substantial look
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#00AF00', // Dark green for the button background
    color: 'black', // Text color for the button
    border: '2px solid #228B22', // Border color for the button
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
