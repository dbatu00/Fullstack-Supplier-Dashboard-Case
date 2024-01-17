import React, { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);

  const simulateApiCall = async () => {
    try {
      setLoading(true);
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('API call successful');
    } catch (error) {
      console.error('Error in API call:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'flex-start', // Align to the top
    height: '100vh',
    padding: '20px', // Add some space at the top
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
      <button onClick={simulateApiCall} style={buttonStyle} disabled={loading}>
        {loading ? 'Loading...' : 'Click Me'}
      </button>
    </div>
  );
}

export default App;
