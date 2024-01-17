import React, { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'flex-start', // Align to the top
    height: '100vh',
    padding: '20px', // Add some space at the top
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
