import React, { useState } from 'react';
import './styles.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState('');
  const [apiData, setApiData] = useState(null);

  const handleButtonClick = async (endpoint) => {
    try {
      setApiData(null); // Clear apiData before fetching new data
      setLoading(true);
      console.log(`Fetching data from /api/${endpoint} with vendor name ${vendor}`);
      const response = await fetch(`http://localhost:5000/api/${endpoint}?vendor=${vendor}`);
      console.log('Fetched successfully');
      console.log('Response:', response);
      const data = await response.json();
      console.log('Data:', data);
      setApiData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
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
        <button className='button' onClick={() => handleButtonClick('monthlySales')}>Monthly Sales</button>
        <button className='button' onClick={() => handleButtonClick('totalSales')}>Total Sales</button>
      </div>
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {apiData && (
        <div>
          <h2>API Data:</h2>
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
