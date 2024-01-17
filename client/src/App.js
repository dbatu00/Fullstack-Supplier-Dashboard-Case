import React, { useState } from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

function App() {
  const [apiData, setApiData] = useState(null);
  const [vendor, setVendor] = useState('Dilvin');
  const [loading, setLoading] = useState(false);

  const fetchData = async (endpoint) => {
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

  const override = css`
    display: block;
    margin: 20px auto; /* Adjust the margin as needed */
    border-color: #36D7B7;
  `;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Vendor Name"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        />
        <button onClick={() => fetchData('monthlySales')}>Monthly Sales</button>
        <button onClick={() => fetchData('totalSales')}>Total Sales</button>
      </div>

      {loading && <ClipLoader color="#36D7B7" loading={loading} css={override} size={50} />}

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
