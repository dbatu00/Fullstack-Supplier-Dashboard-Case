import React, { useState } from 'react';

function App() {
  const [apiData, setApiData] = useState(null);
  const [vendor, setVendor] = useState('');

  const fetchData = async (endpoint) => {
    try {
      console.log(`Fetching data from /api/${endpoint} with vendor name ${vendor}`);
      const response = await fetch(`http://localhost:5000/api/${endpoint}?vendor=${vendor}`);
      console.log('Fetched successfully');
      console.log('Response:', response);
      const data = await response.json();
      console.log('Data:', data);
      setApiData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Vendor Name"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
      />
      <button onClick={() => fetchData('monthlySales')}>Monthly Sales</button>
      <button onClick={() => fetchData('totalSales')}>Total Sales</button>

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
